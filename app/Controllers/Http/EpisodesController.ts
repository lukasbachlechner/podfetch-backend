import PodcastService from 'App/Services/PodcastService';
import EpisodeDto from 'App/Dto/EpisodeDto';
import LikedEpisode from 'App/Models/LikedEpisode';
import PlaybackTimeAdderService from 'App/Services/PlaybackTimeAdderService';

export default class EpisodesController {
  /**
   * Get a single episode by Id.
   * @param request
   */
  public async getById({ request, auth }) {
    const { id } = request.params();
    const { episode } = await PodcastService.episodeById(id, {
      fulltext: true,
    });
    const enhancedItem =
      await PlaybackTimeAdderService.addPlaybackTimeToSingleEpisodes(
        episode,
        auth,
      );
    return new EpisodeDto(enhancedItem);
  }

  /**
   * Get all liked episodes from a user.
   * @param auth
   */
  public async getLiked({ auth }) {
    const liked = await LikedEpisode.query()
      .where('userId', auth.user!.id)
      .orderBy('updatedAt', 'desc');

    const promisedLikedEpisodes = liked.map((like) => {
      return PodcastService.episodeById(parseInt(like.episodeId));
    });

    const allEpisodes = await Promise.all(promisedLikedEpisodes);

    const episodeItems = allEpisodes.map(({ episode }) => episode);
    const enhancedItems =
      await PlaybackTimeAdderService.addPlaybackTimeToMultipleEpisodes(
        episodeItems,
        auth,
      );

    return EpisodeDto.fromArray(enhancedItems);
  }
}
