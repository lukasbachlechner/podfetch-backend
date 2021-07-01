import Dto from 'App/Dto/Dto';
import { DirtyCategories } from '../../types';
import { PIApiCategory } from 'podcastdx-client/src/types';

export default class CategoryDto extends Dto {
  public id: number;
  public name: string;
  public slug: string;

  constructor(category: PIApiCategory) {
    super();
    this.id = category.id;
    this.name = category.name;
    this.slug = this.toSlug(category.name);
  }

  public static fromDirtyCategories(categories: DirtyCategories) {
    const cleanCategories: CategoryDto[] = [];
    for (const key in categories) {
      const category = new CategoryDto({
        id: parseInt(key),
        name: categories[key],
      });
      cleanCategories.push(category);
    }
    return cleanCategories;
  }
}
