import LikedEpisode from 'App/Models/LikedEpisode';

export default class LikedEpisodesController {
  public async like({ request, auth }) {
    const { episodeId } = request.all();
    const payload = {
      episodeId,
      userId: auth.user!.id,
    };
    return await LikedEpisode.firstOrCreate(payload, payload);
  }

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

  public async index({ auth }) {
    return LikedEpisode.query().where('userId', auth.user!.id);
  }
}
