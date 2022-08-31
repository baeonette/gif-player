var express = require('express');
var router = express.Router();
var multer = require('multer');
var { readFileSync, writeFileSync, mkdirSync, cpSync, rm, readdirSync } = require('fs');
var { execSync, exec } = require('child_process');
const { cp, mkdir, writeFile, rmdir } = require('fs/promises');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', (req, res, next) => {
  var storage = multer.diskStorage({
    destination: 'uploads'
  });
  var upload = multer({
    storage: storage
  }).any();

  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.end('Error');
    } else {
      req.files.forEach(async (pkg) => {
        console.log(pkg);
        // Start transfer/conversion protocol
        try {
          // Create folders
          await mkdir(`../media/storage/${pkg.originalname.toLowerCase().replace('gif', 'pkg')}/content/`, { recursive: true });
          // Copy file
          await cp(`${pkg.path}`, `../media/storage/${pkg.originalname.toLowerCase().replace('gif', 'pkg')}/${pkg.originalname.toLowerCase()}`, { recursively: true });
          // Rm from ./uploads
          rm(`${pkg.path}`, err => {
            if (err) console.log(err)
          });
          // Extract frames from GIF
          execSync(`ffmpeg -i ../media/storage/${pkg.originalname.toLowerCase().replace('gif', 'pkg')}/${pkg.originalname.toLowerCase()} -vsync 0 ../media/storage/${pkg.originalname.toLowerCase().replace('gif', 'pkg')}/content/${pkg.originalname.toLowerCase().replace('gif', '')}%03d.png`, { stdio: 'inherit' });
          // Add data.json with pkg object data
          await writeFile(`../media/storage/${pkg.originalname.toLowerCase().replace('gif', 'pkg')}/data.json`, JSON.stringify(pkg, null, 4));

          // Add to playing directory
          var playingDir = readdirSync('../media/playing/');
          await cp(`../media/storage/${pkg.originalname.toLowerCase().replace('gif', 'pkg')}/`, `../media/playing/${pkg.originalname.toLowerCase().replace('gif', 'pkg')}`, { recursive: true });
          if (playingDir.length) rmdir(`../media/playing/${playingDir[0]}`, { recursive: true, force: true });
          res.send({ status: 200, message: 'Uploaded!' });
        } catch (err) {
          // Remove pkg if an error exists
          rm(`${pkg.path}`, err => {
            if (err) console.log(err)
          });
          if (err.code === 'EEXIST') {
            res.send({ status: 500, error: 'File Exists' })
            try {
              // Add to playing directory
              var playingDir = readdirSync('../media/playing/');
              await cp(`../media/storage/${pkg.originalname.toLowerCase().replace('gif', 'pkg')}/`, `../media/playing/${pkg.originalname.toLowerCase().replace('gif', 'pkg')}`, { recursive: true });
              if (playingDir.length) rmdir(`../media/playing/${playingDir[0]}`, { recursive: true, force: true });
            } catch (err) {
              console.log(err);
            }
          }
          else res.send({ status: 500, error: err });
          console.log(err);
          await rmdir(`../media/storage/${pkg.originalname.toLowerCase().replace('gif', 'pkg')}/`, { recursive: true, force: true });
        }
      });
    }
  });
});

module.exports = router;
