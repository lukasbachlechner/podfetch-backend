import httpProxy from 'http-proxy';

export default class AudioController {
  /**
   * Proxy requests to audio files (for cors reasons).
   * @param request
   * @param response
   */
  public async proxy({ request, response }) {
    let { url: proxyTarget } = request.params();
    proxyTarget = decodeURIComponent(proxyTarget);
    const proxy = httpProxy.createProxyServer();

    //  Promisify so that we can await the proxy request
    const proxyPromise = new Promise((resolve, reject) => {
      // Proxy returns data in chunks, so we have to collect and concat it first.
      proxy.on('proxyRes', (proxyRes, _req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');

        let body: any[] = [];
        proxyRes.on('data', (chunk) => {
          body.push(chunk);
        });

        proxyRes.on('end', () => {
          const bodyConcat = Buffer.concat(body).toString();
          resolve(bodyConcat);
        });
      });

      // Use original Node request/response objects
      proxy.web(
        request.request,
        response.response,
        {
          changeOrigin: true,
          target: proxyTarget,
        },
        (e) => {
          // reject on error
          reject(e);
        },
      );
    });

    return await proxyPromise;
  }
}
