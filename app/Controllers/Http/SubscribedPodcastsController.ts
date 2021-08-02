import SubscribedPodcast from 'App/Models/SubscribedPodcast';

export default class SubscribedPodcastsController {
  public async subscribe({ request, auth }) {
    const { podcastId } = request.all();
    const payload = {
      podcastId,
      userId: auth.user!.id,
    };
    return await SubscribedPodcast.firstOrCreate(payload, payload);
  }

  public async unsubscribe({ request, auth }) {
    const { podcastId } = request.all();
    const subscription = await SubscribedPodcast.query()
      .where('podcastId', podcastId)
      .andWhere('userId', auth.user!.id)
      .first();

    if (subscription) {
      await subscription.delete();
    }

    return null;
  }

  public async index({ auth }) {
    return SubscribedPodcast.query().where('userId', auth.user!.id);
  }
}
