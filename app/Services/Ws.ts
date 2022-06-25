import { Server, Socket } from 'socket.io';
import AdonisServer from '@ioc:Adonis/Core/Server';
import WsAuthService from './WsAuthService';
import User from 'App/Models/User';

export interface PfSocket extends Socket {
  authUser: User;
}

export interface SetPlaybackTimePayload {
  episodeId: string;
  playbackTime: number;
}

class Ws {
  public io: Server;
  private booted = false;

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return;
    }

    this.booted = true;
    this.io = new Server(AdonisServer.instance!, {
      cors: {
        origin: '*',
      },
    });
    this.io.use((socket, next) => {
      console.log(socket.handshake.headers['user-agent']);
      next();
    });
    this.io.use(async (socket: PfSocket, next) => {
      const wsAuthService = new WsAuthService();
      const authUser = await wsAuthService.connection(socket);

      if (authUser) {
        socket.authUser = authUser as User;
        next();
      } else {
        next(new Error('invalid token'));
      }
    });
  }
}

export default new Ws();
