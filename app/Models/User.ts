import { DateTime } from 'luxon';
import Hash from '@ioc:Adonis/Core/Hash';
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm';
import PlayedEpisode from 'App/Models/PlayedEpisode';
import SubscribedPodcast from 'App/Models/SubscribedPodcast';
import LikedEpisode from 'App/Models/LikedEpisode';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken?: string;

  @column({
    prepare: (value: string[]) => value.join(','),
    consume: (value: string) => value?.split(',').map((id) => parseInt(id)),
  })
  public categoryPreferences: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => PlayedEpisode)
  public playedEpisodes: HasMany<typeof PlayedEpisode>;

  @hasMany(() => SubscribedPodcast)
  public subscribedPodcasts: HasMany<typeof SubscribedPodcast>;

  @hasMany(() => LikedEpisode)
  public likedEpisodes: HasMany<typeof LikedEpisode>;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
