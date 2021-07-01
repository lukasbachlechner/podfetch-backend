import PodcastService from '../../Services/PodcastService';
import PodcastDto from 'App/Dto/PodcastDto';
import Dto from 'App/Dto/Dto';
import CacheService from 'App/Services/CacheService';
import CategoryDto from 'App/Dto/CategoryDto';

export default class PodcastsController {
  public async getTrending({ request }) {
    const { feeds } = await PodcastService.trending(request.qs());
    return Dto.fromArray(feeds, PodcastDto);
  }

  public async getStats() {
    const cachedStats = await CacheService.getJSON('stats');
    if (cachedStats) {
      return cachedStats;
    }

    const stats = await PodcastService.stats();
    await CacheService.setJSON('stats', stats);
    return stats;
  }

  public async getCategories() {
    const cachedCategories = await CacheService.getJSON('categories');
    if (cachedCategories) {
      return cachedCategories;
    }

    const { feeds } = await PodcastService.categories();
    const categories = Dto.fromArray(feeds, CategoryDto);
    await CacheService.setJSON('categories', categories);
    return categories;
  }
}
