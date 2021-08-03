import PodcastService from 'App/Services/PodcastService';
import EpisodeDto from 'App/Dto/EpisodeDto';
import LikedEpisode from 'App/Models/LikedEpisode';

export default class EpisodesController {
  public async getById({ request }) {
    const { id } = request.params();
    const { episode } = await PodcastService.episodeById(id, {
      fulltext: true,
    });
    return new EpisodeDto(episode);
  }

  public async getLiked({ auth }) {
    const liked = await LikedEpisode.query()
      .where('userId', auth.user!.id)
      .orderBy('updatedAt', 'desc');

    const promisedLikedEpisodes = liked.map((like) => {
      return PodcastService.episodeById(parseInt(like.episodeId));
    });

    const allEpisodes = await Promise.all(promisedLikedEpisodes);

    const episodeItems = allEpisodes.map(({ episode }) => episode);

    return EpisodeDto.fromArray(episodeItems);
  }
}
