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

  public trending(qs?: ApiResponse.AnyQueryOptions): Promise<TrendingPodcasts> {
    const defaults = {
      lang: 'en',
    };
    return super.raw('/podcasts/trending', { ...defaults, ...qs });
  }
}

export default new PodcastService();
