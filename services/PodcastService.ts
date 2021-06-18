import PodcastIndexClient from 'podcastdx-client';
import Env from '@ioc:Adonis/Core/Env';
import { ApiResponse, PIApiPodcast } from 'podcastdx-client/dist/src/types';

export interface Podcasts {
  status: ApiResponse.Status;
  feeds: PIApiPodcast[];
  description: string;
  count: number;
  since: number;
  max: number | undefined;
}

class PodcastService extends PodcastIndexClient {
  constructor() {
    super({
      key: Env.get('PI_API_KEY') as string,
      secret: Env.get('PI_API_SECRET') as string,
      disableAnalytics: true,
    });
  }

  public trending(qs?: ApiResponse.AnyQueryOptions): Promise<Podcasts> {
    return super.raw('/podcasts/trending', qs);
  }
}

export default new PodcastService();
