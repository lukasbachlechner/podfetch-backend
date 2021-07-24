import PodcastService from 'App/Services/PodcastService';
import PodcastDto from 'App/Dto/PodcastDto';
import CacheService from 'App/Services/CacheService';
import CategoryDto from 'App/Dto/CategoryDto';
import EpisodeDto from 'App/Dto/EpisodeDto';
import Fuse from 'fuse.js';

export default class PodcastsController {
  public async getTrending({ request }) {
    const { feeds } = await PodcastService.trending(request.qs());
    return PodcastDto.fromArray(feeds);
  }

  public async getById({ request }) {
    const { id } = request.params();
    const [{ feed }, { items }] = await Promise.all([
      PodcastService.podcastById(id),
      PodcastService.episodesByFeedId(id, { max: 10 }),
    ]);
    const podcast = new PodcastDto(feed);
    podcast.episodes = EpisodeDto.fromArray(items);
    return podcast;
  }

  public async getEpisodesByPodcastId({ request }) {
    const { id } = request.params();
    let { page = '1', per_page: perPage = '10' } = request.qs();

    page = parseInt(page);
    perPage = parseInt(perPage);

    if (page !== 1) {
      const { items } = await PodcastService.episodesByFeedId(id, { max: 1000 });
      const episodes = EpisodeDto.fromArray(items);

      const startIndex = (page - 1) * perPage;
      const endIndex = page * perPage;
      const hasMore = endIndex + perPage + 1 < episodes.length;

      return { episodes: episodes.slice(startIndex, endIndex), hasMore };
    }

    const { items } = await PodcastService.episodesByFeedId(id, { max: 10 });
    return EpisodeDto.fromArray(items);
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
    const categories = CategoryDto.fromArray(feeds);
    await CacheService.setJSON('categories', categories);
    return categories;
  }

  public async search({ request }) {
    const { q: searchTerm } = request.qs();
    if (!searchTerm.length) {
      return {
        podcasts: [],
        categories: [],
      };
    }

    const { feeds } = await PodcastService.search(searchTerm);
    const allCategories = await this.getCategories();

    const fuse = new Fuse(allCategories, {
      keys: ['slug'],
      threshold: 0.2,
    });
    const categories = fuse.search(searchTerm).map((category) => category.item);

    return {
      podcasts: PodcastDto.fromArray(feeds),
      categories,
    };
  }
}
