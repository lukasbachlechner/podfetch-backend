import axios from 'axios';
import sharp from 'sharp';

export default class ImageController {
  /**
   * Resize image on-the-fly.
   * @param request
   * @param response
   */
  public async resize({ request, response }) {
    let { url, size } = request.params();
    url = decodeURIComponent(url);
    const { data } = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    const sharpOutput: Buffer = await sharp(data)
      .resize({ width: parseInt(size) })
      .webp()
      .toBuffer();

    response.header('Content-Type', 'image/webp');
    response.header('Cache-Control', 'public, max-age=604800');
    return sharpOutput;
    // return { output: 'data:image/webp;base64,' + sharpOutput.toString('base64') };
  }
}
