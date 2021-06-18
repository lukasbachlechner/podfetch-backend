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
import PodcastService from '../services/PodcastService';
import CacheService from '../services/CacheService';
import Hash from '@ioc:Adonis/Core/Hash';
import Env from '@ioc:Adonis/Core/Env';

Route.group(() => {
  Route.get('/health', async ({ response }) => {
    const report = await HealthCheck.getReport();
    return report.healthy ? response.ok(report) : response.badRequest(report);
  });

  Route.post('/register', 'AuthController.register');
  Route.post('/login', 'AuthController.login');

  Route.get('/podcasts/stats', 'PodcastsController.getStats');
  Route.get('/podcasts/trending', 'PodcastsController.getTrending');

  Route.put('/cache/:cacheToken', async ({ request, response }) => {
    const { cacheToken } = request.params();

    if (cacheToken !== Env.get('CACHE_TOKEN')) {
      return response.badRequest();
    }

    console.log(await Hash.make('asdkfjlasdfjk'));

    const statsPromise = PodcastService.stats();
    const categoriesPromise = PodcastService.categories();

    const [{ stats }, { feeds: categories }] = await Promise.all([statsPromise, categoriesPromise]);

    await CacheService.setJSON('stats', stats);
    await CacheService.setJSON('categories', categories);

    return response.noContent();
  });
}).prefix('v1');
