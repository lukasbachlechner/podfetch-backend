// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import PodcastService from '../../../services/PodcastService';
import CacheService from '../../../services/CacheService';

export default class PodcastsController {
  public async getTrending({ request }) {
    return await PodcastService.trending(request.qs());
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
}
