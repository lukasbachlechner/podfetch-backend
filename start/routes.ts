/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';
import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import PodcastService from '../app/Services/PodcastService';
import CacheService from '../app/Services/CacheService';
import Env from '@ioc:Adonis/Core/Env';
import axios from 'axios';
import sharp from 'sharp';
import Dto from 'App/Dto/Dto';
import CategoryDto from 'App/Dto/CategoryDto';

Route.group(() => {
  Route.get('/health', async ({ response }) => {
    const report = await HealthCheck.getReport();
    return report.healthy ? response.ok(report) : response.badRequest(report);
  });

  Route.get('/images/:size/:url', async ({ request, response }) => {
    let { url, size } = request.params();
    url = decodeURIComponent(url);
    const { data, headers } = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    console.log(headers);
    const sharpOutput: Buffer = await sharp(data)
      .resize({ width: parseInt(size) })
      .webp()
      .toBuffer();

    response.header('Content-Type', 'image/webp');
    response.header('Cache-Control', 'public, max-age=604800');
    return sharpOutput;
    // return { output: 'data:image/webp;base64,' + sharpOutput.toString('base64') };
  });

  Route.post('/register', 'AuthController.register');
  Route.post('/login', 'AuthController.login');

  Route.get('/stats', 'PodcastsController.getStats');
  Route.get('/categories', 'PodcastsController.getCategories');

  Route.get('/podcasts/trending', 'PodcastsController.getTrending');

  Route.put('/cache/:cacheToken', async ({ request, response }) => {
    const { cacheToken } = request.params();

    if (cacheToken !== Env.get('CACHE_TOKEN')) {
      return response.badRequest();
    }

    const statsPromise = PodcastService.stats();
    const categoriesPromise = PodcastService.categories();

    const [{ stats }, { feeds: categories }] = await Promise.all([statsPromise, categoriesPromise]);

    await CacheService.setJSON('stats', stats);

    const categoriesDto = Dto.fromArray(categories, CategoryDto);
    await CacheService.setJSON('categories', categoriesDto);

    return response.noContent();
  });
}).prefix('v1');
