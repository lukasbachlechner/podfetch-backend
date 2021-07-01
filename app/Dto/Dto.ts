import slugify from 'slugify';

export default class Dto {
  constructor() {}

  protected toSlug(input: string) {
    return slugify(input, {
      lower: true,
    });
  }

  public static fromArray(feeds: any[], dto: any) {
    return feeds.map((feed) => new dto(feed));
  }
}
