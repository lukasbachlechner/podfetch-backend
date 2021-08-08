import LikedEpisode from 'App/Models/LikedEpisode';

export default class LikedEpisodesController {
  /**
   * Like an episode.
   * @param request
   * @param auth
   */
  public async like({ request, auth }) {
    const { episodeId } = request.all();
    const payload = {
      episodeId,
      userId: auth.user!.id,
    };
    return await LikedEpisode.firstOrCreate(payload, payload);
  }

  /**
   * Unlike an episode.
   * @param request
   * @param auth
   */
  public async unlike({ request, auth }) {
    const { episodeId } = request.all();
    const like = await LikedEpisode.query()
      .where('episodeId', episodeId)
      .andWhere('userId', auth.user!.id)
      .first();

    if (like) {
      await like.delete();
    }

    return null;
  }

  /**
   * List all liked episodes.
   * @param auth
   */
  public async index({ auth }) {
    return LikedEpisode.query().where('userId', auth.user!.id);
  }
}
