import PlayedEpisode from 'App/Models/PlayedEpisode';

export default class PlaybackTimeAdderService {
  public static async addPlaybackTimeToMultipleEpisodes(rawEpisodes, auth) {
    let episodes = rawEpisodes;

    if (auth.isLoggedIn) {
      const playedEpisodes = await PlayedEpisode.query().where(
        'userId',
        auth.user!.id,
      );
      episodes = episodes.map((episode) => {
        const correspondingPlayedEpisode = playedEpisodes.find(
          (playedEpisode) => playedEpisode.episodeId == episode.id,
        );
        if (correspondingPlayedEpisode) {
          return {
            ...episode,
            playbackTime: correspondingPlayedEpisode.playbackTime,
          };
        }

        return episode;
      });
    }

    return episodes;
  }

  public static async addPlaybackTimeToSingleEpisodes(rawEpisode, auth) {
    let episode = rawEpisode;

    if (auth.isLoggedIn) {
      const playedEpisode = await PlayedEpisode.findBy('episodeId', episode.id);
      if (playedEpisode) {
        return {
          ...episode,
          playbackTime: playedEpisode.playbackTime,
        };
      }
      return episode;
    }

    return episode;
  }
}
