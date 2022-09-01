var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var { execSync, exec } = require('child_process');
const path = require('path');
const upload = multer();

/* GET files. */
router.get('/', function (req, res, next) {
  var package = [];

  res.sendFile(`media/storage/strider.gif`, { root: path.join('../backend/') }, err => {
    console.log(err)
  })

});

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
        res.send({ status: 200, message: 'File added!' });
        resolve();
      });
    });
  };

});

module.exports = router;
