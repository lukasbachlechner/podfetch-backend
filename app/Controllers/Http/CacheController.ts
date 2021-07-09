import Env from '@ioc:Adonis/Core/Env';
import PodcastService from 'App/Services/PodcastService';
import CacheService from 'App/Services/CacheService';
import CategoryDto from 'App/Dto/CategoryDto';

export default class CacheController {
  /**
   * Renews the Redis cache for stats & categories
   * @param request
   * @param response
   */
  public async bust({ request, response }) {
    const { cacheToken } = request.params();

    if (cacheToken !== Env.get('CACHE_TOKEN')) {
      return response.badRequest();
    }

    const statsPromise = PodcastService.stats();
    const categoriesPromise = PodcastService.categories();

    const [{ stats }, { feeds: categories }] = await Promise.all([statsPromise, categoriesPromise]);

    await CacheService.setJSON('stats', stats);

    const categoriesDto = CategoryDto.fromArray(categories);
    await CacheService.setJSON('categories', categoriesDto);

    return response.noContent();
  }
}
