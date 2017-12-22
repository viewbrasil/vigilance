module.exports = Updater;
var utilities = require('../helpers/utils.js');
var utils = new utilities;
var exec = require('child_process').exec;
var log = require('captains-log')();
var fs = require('fs');
var utf8 = require('utf8');
const prettier = require("prettier");
var pretty = require('pretty');

function Updater(request, res) {

  this.request = request;
  this.response = res;
}

Updater.prototype.verify_git = function()
{
  timed_check();
}

function timed_check()
{
  setTimeout(function(){

    shell_exec('git diff-index --quiet HEAD -- || echo "untracked"; ')
    timed_check();

   }, 1000);
}

function shell_exec(command,file,response,func)
{
  exec(command , function(error, stdout, stderr) {

    if (typeof error != null) {
      if(func == true)
      {
      log.info(stdout)
      }
      else {
        log.info(stdout)
      }
    }
  });
}
