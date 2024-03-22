import { Controller } from 'egg';
import path from 'node:path';
import fs, { mkdirSync } from 'node:fs';
import stream from 'node:stream';
import util from 'node:util';
import { randomUUID } from 'node:crypto';
const pipeline = util.promisify(stream.pipeline);

export default class CrashController extends Controller {
  async index() {
    const { ctx } = this;
    const parts = ctx.multipart();

    // const fields = {};
    // const files = {};
    const updateDir = path.join(process.cwd(), 'upload');

    if (!fs.existsSync(updateDir)) {
      mkdirSync(updateDir);
    }
    for await (const part of parts as any) {
      console.log('part');
      console.log(part);

      if (Array.isArray(part)) {
        // fields
        console.log('field: ' + part[0]);
        console.log('value: ' + part[1]);
      } else {
        const { filename, fieldname, encoding, mime } = part;

        console.log('field: ' + fieldname);
        console.log('filename: ' + filename);
        console.log('encoding: ' + encoding);
        console.log('mime: ' + mime);

        const targetPath = path.join(updateDir, randomUUID() + filename);
        await pipeline(part, fs.createWriteStream(targetPath));
      }
    }

    console.log(ctx);
    ctx.body = 'crash';
  }
}
