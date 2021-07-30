import PlayedEpisode from 'App/Models/PlayedEpisode';
import PodcastService from 'App/Services/PodcastService';
import EpisodeDto from 'App/Dto/EpisodeDto';

export default class PlayedEpisodesController {
  /**
   * Set episode & last playback time of a given episode
   * @param request
   * @param response
   * @param auth
   */
  public async setLastPlaybackTime({ request, response, auth }) {
    const { playbackTime, episodeId } = request.all();

    const searchPayload = { episodeId };
    const updatePayload = {
      playbackTime,
      episodeId,
      userId: auth.user!.id,
    };

    await PlayedEpisode.updateOrCreate(searchPayload, updatePayload);

    return response.noContent();
  }

  public async getLastPlayback({ auth }) {
    const { episodeId, playbackTime } = await PlayedEpisode.query()
      .where('userId', auth.user!.id)
      .orderBy('updatedAt', 'desc')
      .firstOrFail();

    const { episode } = await PodcastService.episodeById(parseInt(episodeId));

    return { episode: new EpisodeDto(episode), playbackTime };
  }
}
