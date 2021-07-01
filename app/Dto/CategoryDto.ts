import Dto from 'App/Dto/Dto';

export default class CategoryDto extends Dto {
  public id: number;
  public title: string;
  public slug: string;

  constructor(category: any) {
    super();
    this.id = category.id;
    this.title = category.title;
    this.slug = this.toSlug(category.title);
  }
}
