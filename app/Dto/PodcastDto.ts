import CategoryDto from 'App/Dto/CategoryDto';
import Dto from 'App/Dto/Dto';
import { PIApiPodcast } from 'podcastdx-client/src/types';
import EpisodeDto from 'App/Dto/EpisodetDto';

export default class PodcastDto extends Dto {
  public id: number;
  public url: string;
  public title: string;
  public titleSlug: string;
  public description: string;
  public author: string;
  public image: string;
  public language: string;
  public categories: CategoryDto[];
  public episodes: EpisodeDto[] = [];

  constructor(podcast: PIApiPodcast) {
    super(podcast);
    this.id = podcast.id;
    this.url = podcast.url;
    this.title = podcast.title;
    this.titleSlug = this.toSlug(podcast.title);
    this.description = podcast.description;
    this.author = podcast.author;
    this.image = podcast.image;
    this.language = podcast.language;
    this.categories = CategoryDto.fromDirtyCategories(podcast.categories);
  }
}
