var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var { execSync, exec } = require('child_process');
const upload = multer();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', (req, res, next) => {
  const file = req.body;
  const base64data = file.content.replace(/^data:.*,/, '');

  fs.writeFile('uploads/' + `${file.name.toLowerCase().replace('.gif', '')}.gif`, base64data, 'base64', async (err) => {
    if (err) {
      console.log(err);
      res.send({ status: 500, message: 'An error occurred saving the file: ' + err });
    } else {
      await transfer();
    }
  });

  const transfer = async () => {

    await new Promise((resolve) => {
      try {
        var dir = fs.readdirSync(`../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')}`);
      } catch (err) {
        dir = false;
      }

      // Check for directory
      if (dir) {
        exec(`rm uploads/${file.name}`);
        return res.send({ status: 500, message: 'File already exists' }) && resolve();
      }
      // Make directory
      exec(`mkdir ../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')}/`, async (err, out, stderr) => {

        if (err && err.toString().toLowerCase().includes('file exists')) return res.send({ status: 500, message: 'File already exists' }) && resolve();

        // Add content
        exec(`mkdir ../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')}/content/`);
        exec(`cp ./uploads/${file.name} ../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')} && rm uploads/${file.name}`);

        // Pull frames
        exec(`ffmpeg -i ../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')}/${file.name.toLowerCase()} -vsync 0 ../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')}/content/${file.name.toLowerCase().replace('gif', '')}%03d.png`);

        // Add data.json with gif data
        delete file.content;

        fs.writeFile(`../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')}/data.json`, JSON.stringify(file, null, 4), (err) => {
          console.log(err);
        });
        res.send({ status: 200, message: 'File added!' });
        resolve();
      });
    });

    // // Extract frames from GIF
    // execSync(`ffmpeg -i ../media/storage/${pkg.originalName.toLowerCase().replace('gif', 'pkg')}/${pkg.originalName.toLowerCase()} -vsync 0 ../media/storage/${pkg.originalName.toLowerCase().replace('gif', 'pkg')}/content/${pkg.originalName.toLowerCase().replace('gif', '')}%03d.png`, { stdio: 'inherit' });
    // // Add data.json with pkg object data
    // writeFile(`../media/storage/${pkg.originalName.toLowerCase().replace('gif', 'pkg')}/data.json`, JSON.stringify(pkg, null, 4));

    // // Add to playing directory
    // var playingDir = readdirSync('../media/playing/');
    // cp(`../media/storage/${pkg.originalName.toLowerCase().replace('gif', 'pkg')}/`, `../media/playing/${pkg.originalName.toLowerCase().replace('gif', 'pkg')}`, { recursive: true });
    // if (playingDir.length) rmdir(`../media/playing/${playingDir[0]}`, { recursive: true, force: true });
    //     res.send({ status: 200, message: 'Uploaded!' });
    //   } catch (err) {
    //     return console.log(err)
    //     // Remove pkg if an error exists
    //     rm(`${pkg.path}`, err => {
    //       if (err) console.log(err)
    //     });
    //     if (err.code === 'EEXIST') {
    //       res.send({ status: 500, error: 'File Exists' })
    //       try {
    //         // Add to playing directory
    //         var playingDir = readdirSync('../media/playing/');
    //         cp(`../media/storage/${pkg.originalName.toLowerCase().replace('gif', 'pkg')}/`, `../media/playing/${pkg.originalName.toLowerCase().replace('gif', 'pkg')}`, { recursive: true });
    //         if (playingDir.length) rmdir(`../media/playing/${playingDir[0]}`, { recursive: true, force: true });
    //       } catch (err) {
    //         console.log(err);
    //       }
    //     }
    //     else res.send({ status: 500, error: err });
    //     console.log(err);
    //     rmdir(`../media/storage/${pkg.originalName.toLowerCase().replace('gif', 'pkg')}/`, { recursive: true, force: true });
    //   }
    // });
  };
});

module.exports = router;
