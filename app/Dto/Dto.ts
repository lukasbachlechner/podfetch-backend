import slugify from 'slugify';

export default class Dto {
  /**
   * Empty constructor, otherwise new this() wouldn't work.
   * @param _item
   */
  constructor(_item: any) {}

  /**
   * Slugify any given input.
   * @param input
   * @protected
   */
  protected toSlug(input: any) {
    if (typeof input !== 'string') {
      return input;
    }
    return slugify(input, {
      lower: true,
      remove: /[*+~.()'"!:@/,#?]/g,
    });
  }

  /**
   * Create corresponding Dtos from a derived class (e. g. PodcastDto.fromArray).
   * @param items
   */
  public static fromArray(items) {
    return items.map((item) => new this(item));
  }
}
