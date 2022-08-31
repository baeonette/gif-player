var express = require('express');
var router = express.Router();
var fs = require('fs');
var { cwd } = require('process');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('Routes: ')

  var routes = [];
  var routeDir = fs.readdirSync('routes/');
  for (var route of routeDir) {
    routes.push(route);
  }

  console.log(routes);

  res.render('index', { title: 'Express', routes: 'Nice' });
});

module.exports = router;
