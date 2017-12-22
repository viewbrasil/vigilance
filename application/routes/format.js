var express = require('express');
var router = express.Router();
var Updater = require('../services/updater.js');

router.get('/', function(req, res, next) {
  let update = new Updater(req,res);
  update.verify_git();
});

module.exports = router;
