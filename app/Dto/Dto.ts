import slugify from 'slugify';

export default class Dto {
  constructor(_item: any) {}

  protected toSlug(input: string) {
    return slugify(input, {
      lower: true,
      remove: /[*+~.()'"!:@/,#?]/g,
    });
  }

  public static fromArray(items) {
    return items.map((item) => new this(item));
  }
}
