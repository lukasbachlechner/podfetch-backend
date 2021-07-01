import { PIApiPodcast } from 'podcastdx-client/src/types';
import { ApiResponse } from 'podcastdx-client/dist/src/types';

export type ApiPodcast = PIApiPodcast & {
  trendScore: number;
};

export interface TrendingPodcasts {
  status: ApiResponse.Status;
  feeds: PIApiPodcast[];
  description: string;
  count: number;
  since: number;
  max: number | undefined;
}
