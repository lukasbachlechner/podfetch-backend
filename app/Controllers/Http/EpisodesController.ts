import PodcastService from 'App/Services/PodcastService';
import EpisodeDto from 'App/Dto/EpisodeDto';

export default class EpisodesController {
  public async getById({ request }) {
    const { id } = request.params();
    const { episode } = await PodcastService.episodeById(id, {
      fulltext: true,
    });
    return new EpisodeDto(episode);
  }
}
