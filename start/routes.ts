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

Route.group(() => {
  Route.get('/health', async ({ response }) => {
    const report = await HealthCheck.getReport();
    return report.healthy ? response.ok(report) : response.badRequest(report);
  });

  Route.get('/images/:size/:url', 'ImageController.resize');
  Route.get('/audio/:url', 'AudioController.proxy');

  Route.post('/auth/register', 'AuthController.register');
  Route.post('/auth/login', 'AuthController.login');
  Route.get('/auth/check-email', 'AuthController.checkEmail');

  Route.get('/stats', 'PodcastsController.getStats');
  Route.get('/categories', 'PodcastsController.getCategories');

  Route.get('/search', 'PodcastsController.search');

  Route.get('/podcasts/trending', 'PodcastsController.getTrending');

  Route.get('/podcasts/:id', 'PodcastsController.getById');
  Route.get('/podcasts/:id/episodes', 'PodcastsController.getEpisodesByPodcastId');

  Route.get('/episodes/:id', 'EpisodesController.getById');

  Route.put('/cache/:cacheToken', 'CacheController.bust');

  Route.group(() => {
    Route.get('/auth/me', 'AuthController.getUser');
    Route.post('/auth/logout', 'AuthController.logout');
  }).middleware('auth');
}).prefix('v1');
