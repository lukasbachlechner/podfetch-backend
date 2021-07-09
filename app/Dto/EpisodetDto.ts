import Dto from 'App/Dto/Dto';
import { PIApiEpisodeDetail } from 'podcastdx-client/src/types';
import { string } from '@ioc:Adonis/Core/Helpers';

export default class EpisodeDto extends Dto {
  public id: number;
  public title: string;
  public titleSlug: string;
  public description: string;
  public excerpt: string;
  public image: string;
  public language: string;
  public podcastId: number;
  public podcastTitle: string;
  public explicit: boolean;
  public audioUrl: string;
  public audioType: string;
  public audioSize: number;
  public audioPrettySize: string;
  public audioDuration: number;
  public datePublished: number;
  public originalEpisode: PIApiEpisodeDetail;

  constructor(episode: PIApiEpisodeDetail) {
    super(episode);
    this.id = episode.id;
    this.title = episode.title;
    this.titleSlug = this.toSlug(episode.title);
    this.description = episode.description;
    this.image = episode.image || episode.feedImage;
    this.language = episode.feedLanguage;
    this.podcastId = episode.feedId;
    this.podcastTitle = episode.feedTitle;
    this.explicit = episode.explicit === 1;
    this.audioUrl = episode.enclosureUrl;
    this.audioType = episode.enclosureType;
    this.audioSize = episode.enclosureLength;
    this.audioDuration = episode.duration;
    this.audioPrettySize = string.prettyBytes(episode.enclosureLength);
    this.datePublished = episode.datePublished;

    this.originalEpisode = episode;

    this.generateExcerpt();
  }

  private generateExcerpt(): void {
    let cleanExcerpt = string.excerpt(this.description, 240);
    cleanExcerpt = string.condenseWhitespace(cleanExcerpt);
    this.excerpt = cleanExcerpt;
  }
}
