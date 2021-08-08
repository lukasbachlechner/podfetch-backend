import PodcastIndexClient from 'podcastdx-client';
import Env from '@ioc:Adonis/Core/Env';
import { ApiResponse } from 'podcastdx-client/src/types';
import { TrendingPodcasts } from '../../types';

class PodcastService extends PodcastIndexClient {
  constructor() {
    super({
      key: Env.get('PI_API_KEY') as string,
      secret: Env.get('PI_API_SECRET') as string,
      disableAnalytics: true,
    });
  }

  /**
   * Overwrite the super.raw method to include a default language.
   * @param endpoint
   * @param qs
   */
  public raw<T>(
    endpoint: string,
    qs?: ApiResponse.AnyQueryOptions,
  ): Promise<T> {
    const defaults = {
      lang: 'en',
    };
    return super.raw(endpoint, { ...defaults, ...qs });
  }

  public trending(qs?: ApiResponse.AnyQueryOptions): Promise<TrendingPodcasts> {
    return this.raw('/podcasts/trending', qs);
  }
}

export default new PodcastService();
