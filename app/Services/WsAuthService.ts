import User from 'App/Models/User';
import { Socket } from 'socket.io';
import { createHash } from 'crypto';
import CacheService from './CacheService';

export default class WsAuthService {
  public urlDecode(encoded) {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  }

  public generateHash(token) {
    return createHash('sha256').update(token).digest('hex');
  }

  public parseToken(token: string) {
    const parts = token.split('.');
    /**
     * Ensure the token has two parts
     */
    if (parts.length !== 2) {
      throw new Error('length mismatch');
    }

    /**
     * Ensure the first part is a base64 encode id
     */
    const tokenId = this.urlDecode(parts[0]);

    if (!tokenId) {
      throw new Error('token id not valid');
    }

    const parsedToken = this.generateHash(parts[1]);
    return {
      token: parsedToken,
      tokenId,
    };
  }

  public async checkToken(token: string): Promise<User> {
    const parsedToken = this.parseToken(token);
    const apiToken = await CacheService.getJSON(`api:${parsedToken.tokenId}`);
    const isTokenValid = apiToken.token === parsedToken.token;
    if (!apiToken) {
      throw new Error('token not in cache');
    }

    if (!isTokenValid) {
      throw new Error('token is not valid');
    }

    const user = await User.findBy('id', apiToken!.user_id);

    return user as User;
  }

  public async authenticate(socket: Socket): Promise<User> {
    const token = socket.handshake?.auth?.token;
    if (!token || typeof token !== 'string') {
      throw new Error('missing params');
    }

    try {
      const user = await this.checkToken(token);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async connection(socket: Socket): Promise<User | Boolean> {
    try {
      const user = await this.authenticate(socket);
      return user;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
