import PodcastService from 'App/Services/PodcastService';
import PodcastDto from 'App/Dto/PodcastDto';
import CacheService from 'App/Services/CacheService';
import CategoryDto from 'App/Dto/CategoryDto';
import EpisodeDto from 'App/Dto/EpisodeDto';
import Fuse from 'fuse.js';
import SubscribedPodcast from 'App/Models/SubscribedPodcast';

export default class PodcastsController {
  /**
   * Get trending podcasts.
   * @param request
   */
  public async getTrending({ request }) {
    const { feeds } = await PodcastService.trending(request.qs());
    return PodcastDto.fromArray(feeds);
  }

  /**
   * Get a single podcast by Id.
   * @param request
   */
  public async getById({ request }) {
    const { id } = request.params();
    const { maxEpisodes = 10 } = request.qs();
    const [{ feed }, { items }] = await Promise.all([
      PodcastService.podcastById(id),
      PodcastService.episodesByFeedId(id, { max: maxEpisodes }),
    ]);
    const podcast = new PodcastDto(feed);
    podcast.episodes = EpisodeDto.fromArray(items);
    return podcast;
  }

  /**
   * Get all episodes that belong to a podcast.
   * @param request
   */
  public async getEpisodesByPodcastId({ request }) {
    const { id } = request.params();
    let { page = '1', per_page: perPage = '10' } = request.qs();

    page = parseInt(page);
    perPage = parseInt(perPage);

    if (page !== 1) {
      // get all available episodes and paginate them here - sorry! :D
      const { items } = await PodcastService.episodesByFeedId(id, {
        max: 1000,
      });
      const episodes = EpisodeDto.fromArray(items);

      const startIndex = (page - 1) * perPage;
      const endIndex = page * perPage;
      const hasMore = endIndex < episodes.length;

      return { episodes: episodes.slice(startIndex, endIndex), hasMore };
    }

    const { items } = await PodcastService.episodesByFeedId(id, { max: 10 });
    return EpisodeDto.fromArray(items);
  }

  /**
   * Get the stats.
   */
  public async getStats() {
    const cachedStats = await CacheService.getJSON('stats');
    if (cachedStats) {
      return cachedStats;
    }

    const stats = await PodcastService.stats();
    await CacheService.setJSON('stats', stats);
    return stats;
  }

  /**
   * Get all categories.
   */
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

  /**
   * Search for a given term in all podcasts as well as all categories in Redis.
   * @param request
   */
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

    // fuzzy search
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

  /**
   * Get podcasts based on the chosen categories on signup.
   * @param request
   * @param auth
   */
  public async getPersonalized({ request, auth }) {
    const { max } = request.qs();
    const preferences = await auth.user!.categoryPreferences.join(',');
    const { feeds } = await PodcastService.trending({
      cat: preferences,
      max,
    });

    return PodcastDto.fromArray(feeds);
  }

  /**
   * Get all episodes that the user has subscribed.
   * @param auth
   */
  public async getSubscribed({ auth }) {
    const subscriptions = await SubscribedPodcast.query()
      .where('userId', auth.user!.id)
      .orderBy('updatedAt', 'desc');
    const promisedSubscribedPodcasts = subscriptions.map((subscription) => {
      return PodcastService.podcastById(parseInt(subscription.podcastId));
    });

    const allPodcasts = await Promise.all(promisedSubscribedPodcasts);

    const podcastFeeds = allPodcasts.map(({ feed }) => feed);

    return PodcastDto.fromArray(podcastFeeds);
  }

  /**
   * Get all podcasts in a given category.
   * @param request
   */
  public async getByCategory({ request }) {
    let { categorySlug } = request.params();
    categorySlug = categorySlug.replace('-', '+');
    // we could somehow paginate here
    const { feeds } = await PodcastService.trending({
      cat: categorySlug,
      max: 48,
    });

    return PodcastDto.fromArray(feeds);
  }
}
