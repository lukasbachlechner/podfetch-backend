import PodcastService from '../../Services/PodcastService';
import CacheService from '../../Services/CacheService';
import PodcastDto from 'App/Dto/PodcastDto';
import Dto from 'App/Dto/Dto';

export default class PodcastsController {
  public async getTrending({ request }) {
    const { feeds } = await PodcastService.trending(request.qs());
    // return feeds.map((feed) => new PodcastDto(feed));
    return Dto.fromArray(feeds, PodcastDto);
  }

  public async getStats() {
    const cachedStats = await CacheService.getJSON('stats');
    if (cachedStats) {
      return cachedStats;
    }

    console.log('no cache');

    const stats = await PodcastService.stats();
    await CacheService.setJSON('stats', stats);
    return stats;
  }
}
