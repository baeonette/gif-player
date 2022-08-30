var express = require('express');
var router = express.Router();
var fs = require('fs');
var { cwd } = require('process');

/* GET home page. */
router.get('/', function (req, res, next) {

  // Get archived gifs
  const gifArchive = fs.readdirSync('/media/');
  for (const buttonPath of gifArchive) {
    const buttonFiles = fs
      .readdirSync(__dirname + '/interactions/buttons/' + buttonPath)
      .filter((x) => x.endsWith('.button.js'));

    for (var buttonFile of buttonFiles) {
      const button = require(path.join(__dirname, 'interactions/buttons/' + buttonPath + '/' + `${buttonFile}`));
      client.buttonHandler.set(button.button_id, button);
    }
  }
});

module.exports = router;
