import { string } from '@ioc:Adonis/Core/Helpers';
import Redis from '@ioc:Adonis/Addons/Redis';

export default class CacheService {
  public static async getJSON(key: string) {
    const cached = await Redis.get(key);
    return cached ? JSON.parse(cached) : false;
  }

  public static async setJSON(key: string, value: any, ttl?: string) {
    if (ttl) {
      await Redis.set(key, JSON.stringify(value), 'px', string.toMs(ttl));
    } else {
      await Redis.set(key, JSON.stringify(value));
    }
  }
}
