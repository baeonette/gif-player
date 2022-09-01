var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var { execSync, exec } = require('child_process');
const path = require('path');
const upload = multer();

// Get all gifs
router.get('/gifs', (req, res, next) => {
  var gifs = fs.readdirSync('./media/storage');
  gifs.shift() // Remove ".storage"
  res.json(gifs);
});

// Get playing GIF
router.get('/playing', (req, res, next) => {
  var gifs = fs.readdirSync('./media/playing');
  gifs.shift() // Remove ".storage"
  res.json(gifs);
});

// Upload GIF
router.post('/', (req, res, next) => {
  const file = req.body;
  const base64data = file.content.replace(/^data:.*,/, '');

  fs.writeFile('./media/uploads/' + `${file.name.toLowerCase()}`, base64data, 'base64', async (err) => {
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
        var fileExists = fs.readFileSync(`./media/storage/${file.name.toLowerCase()}`);
      } catch (err) {
        fileExists = false;
      }

      // Check for directory
      if (fileExists) {
        exec(`rm ./media/uploads/${file.name.toLowerCase()}`);
        return res.send({ status: 500, message: `File already exists. Jump to it <a href="#${file.name.toLowerCase()}">here</a>` }) && resolve();
      }

      // Copy to storage
      exec(`cp ./media/uploads/${file.name.toLowerCase()} ./media/storage/; rm ./media/uploads/${file.name.toLowerCase()}`, async (err, out, stderr) => {

        if (err && err.toString().toLowerCase().includes('file exists')) return res.send({ status: 500, message: `File already exists in storage. Jump to it <a href="#${file.name.toLowerCase()}">here</a>` }) && resolve();

        // Send success
        res.send({ status: 200, message: `File added! Jump to it <a href="#${file.name.toLowerCase()}">here</a>` });
        resolve();
      });
    });
  };
}); // Upload GIF end

// Play GIF
router.post('/play', async (req, res, next) => {
  var gif = req.body.gif;

  // Delete other GIFs
  var playing = fs.readdirSync('./media/playing');
  playing.shift(); // Remove .playing file

  if (playing && playing.length) fs.unlink('./media/playing/' + playing[0]);

  // Copy GIF to playing dir
  var cpGif = fs.createReadStream('./media/storage/' + gif);
  cpGif.pipe(fs.createWriteStream('./media/playing/' + gif));

  res.send({ status: 200, message: `Playing ${gif}!` });
}); // Play GIF end

// Delete GIF
router.delete('/delete', (req, res, next) => {
  var gif = req.body.gif;
  fs.unlink(`./media/storage/${gif}`, (err) => {
    if (err) return res.send({ status: 500, messages: 'An error occurred deleting the GIF' });
  });

  var playing = fs.readdirSync('./media/playing');
  playing.shift(); // Remove .playing file

  if (playing && playing.length && playing[0] === gif) fs.unlink(`./media/playing/${gif}`, (err) => {
    if (err) return res.send({ status: 500, messages: 'An error occurred deleting the GIF from the playing directory' });
  });

  res.send({ status: 200, messages: 'Success!' });
}); // Delete GIF end

module.exports = router;
