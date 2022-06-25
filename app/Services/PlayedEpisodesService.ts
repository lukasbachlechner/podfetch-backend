import PlayedEpisode from 'App/Models/PlayedEpisode';
import { PfSocket, SetPlaybackTimePayload } from './Ws';

export default class PlayedEpisodesService {
  /**
   * Set episode & last playback time of a given episode – WebSockets implementation
   * @param socket
   * @param payload
   */
  static async setLastPlaybackTimeWs(
    socket: PfSocket,
    payload: SetPlaybackTimePayload,
  ) {
    const { playbackTime, episodeId } = payload;

    const searchPayload = { episodeId };
    const updatePayload = {
      playbackTime,
      episodeId,
      userId: socket.authUser!.id,
    };

    await PlayedEpisode.updateOrCreate(searchPayload, updatePayload);
  }
}
