const path = require('path');
const fse = require('fs-extra');
const Koa = require('koa');
const multiparty = require('multiparty');
const Controller = require('./controller.js');

const controller = new Controller();


const UPLOAD_DIR = path.resolve(__dirname, '.', 'target');

const app = new Koa();

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Headers", "*");
  ctx.set("Content-Type", "application/json");
  await next();
})

app.use(async (ctx, next) => {
  // console.log(ctx.request);
  if (ctx.url === '/') {
    // 取出chunk和filename
    const multipart = new multiparty.Form();
    // console.log(multipart);
    multipart.parse(ctx.req, async (err, fields, files) => {
      if (err) {
        return;
      }
      const [chunk] = files.chunk; // 取第一项
      const [filename] = fields.filename;
      // const [size] = fields.size;
      const { size } = files.chunk[0];
      // console.log(size, 1);
      console.log(chunk, filename)
      const dir_name = filename.split('.')[0];
      const chunkDir = path.resolve(UPLOAD_DIR, dir_name);
      console.log(chunkDir, 123)
      if (!fse.existsSync(chunkDir)) {
        await fse.mkdir(chunkDir);
      }
      // chunk.path：临时存放文件的路径
      await fse.move(chunk.path, `${chunkDir}/${filename}`);
    })
    ctx.body = { code: 0, msg: 'success' };
  }
})



app.listen(3000, () => console.log('listening on port 3000..'));
