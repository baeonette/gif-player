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
        play();
        return res.send({ status: 500, message: 'File already exists' }) && resolve();
      }
      // Make directory
      exec(`mkdir ../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')}/`, async (err, out, stderr) => {

        if (err && err.toString().toLowerCase().includes('file exists')) return res.send({ status: 500, message: 'Adding file to queue' }) && play() && resolve();

        // Add content
        exec(`mkdir ../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')}/content/`);
        exec(`cp ./uploads/${file.name} ../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')} && rm uploads/${file.name}`);

        // Pull frames
        exec(`ffmpeg -i ../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')}/${file.name.toLowerCase()} -vsync 0 ../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')}/content/${file.name.toLowerCase().replace('gif', '')}%03d.png`, async (err, out, stderr) => {
          // Add data.json with gif data
          delete file.content;

          fs.writeFile(`../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')}/data.json`, JSON.stringify(file, null, 4), (err) => {
            console.log(err);
          });

          play();

          res.send({ status: 200, message: 'File added!' });
          resolve();
        });
      });
    });

    function play(dir) {

      try {
        var dir = fs.readdirSync(`../media/playing/`);
      } catch (err) {
        dir = false;
      }

      exec(`mkdir -p ../media/playing/; cp -r ../media/storage/${file.name.toLowerCase().replace('gif', 'pkg')}/ ../media/playing/`, async (err, out, stderr) => {
        if (err) return console.log(err);
        exec('sleep 1; bash ../stop.sh; sleep 1; bash ../run.sh');
      });

      if (dir) {
        exec(`rm -rf ../media/playing/${dir[0]}/`, async (err, out, stderr) => {
          if (err) return console.log(err);
          exec('sleep 1; bash ../stop.sh; sleep 1; bash ../run.sh');
        });
      };
    };

  };

});

module.exports = router;
