import Redis from '@ioc:Adonis/Addons/Redis';
import { string } from '@ioc:Adonis/Core/Helpers';

export default class CacheService {
  public static async getJSON(key: string) {
    const cached = await Redis.get(key);
    return cached ? JSON.parse(cached) : false;
  }

  public static async setJSON(key: string, value: any, ttl?: string) {
    if (ttl) {
      await Redis.set(key, JSON.stringify(value), 'PX', string.toMs(ttl));
    } else {
      await Redis.set(key, JSON.stringify(value));
    }
  }
}
