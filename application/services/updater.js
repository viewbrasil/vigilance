module.exports = Updater;
var utilities = require('../helpers/utils.js');
var utils = new utilities;
var exec = require('child_process').exec;
var log = require('captains-log')();
var fs = require('fs');
var utf8 = require('utf8');
const prettier = require("prettier");
var pretty = require('pretty');

function Updater() {

}

Updater.prototype.verify_git = function(path)
{
  timed_check(path);
}

function timed_check(path)
{
  setTimeout(function(){

    shell_exec(path + ' git diff-index --quiet HEAD -- || echo "untracked"')
    timed_check(path);

   }, 1000);
}

function work_on_response(response)
{
  log.info(response);
  "klajflksdjfldkjsdfsdfdsfsdflkd"
  if(response.trim() == '"untracked"')
  {
    log.info('we need to act');
  }
  else {
    log.info('everything is fine');
  }
}

function shell_exec(command,file,response,func)
{
  exec(command , function(error, stdout, stderr) {

    if (typeof error != null) {

      work_on_response(stdout);

    }
  });
}
