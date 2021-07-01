import CategoryDto from 'App/Dto/CategoryDto';
import Dto from 'App/Dto/Dto';
import { PIApiPodcast } from 'podcastdx-client/src/types';

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

  constructor(podcast: PIApiPodcast) {
    super();
    this.id = podcast.id;
    this.url = podcast.url;
    this.title = podcast.title;
    this.titleSlug = this.toSlug(podcast.title);
    this.description = podcast.description;
    this.author = podcast.author;
    this.image = podcast.image;
    this.language = podcast.language;
    this.mapCategories(podcast.categories);
  }

  private mapCategories(categories: any) {
    const mappedCategories: CategoryDto[] = [];
    for (const key in categories) {
      const category = new CategoryDto({
        id: key,
        title: categories[key],
      });
      mappedCategories.push(category);
    }

    this.categories = mappedCategories;
  }
}
