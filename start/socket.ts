import PlayedEpisodesService from 'App/Services/PlayedEpisodesService';
import Ws, { PfSocket, SetPlaybackTimePayload } from 'App/Services/Ws';
Ws.boot();

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket: PfSocket) => {
  socket.on('set-playback-time', (payload: SetPlaybackTimePayload) => {
    PlayedEpisodesService.setLastPlaybackTimeWs(socket, payload);
  });
});
