module.exports = Updater;
var utilities = require('../helpers/utils.js');
var utils = new utilities;
var exec = require('child_process').exec;
var log = require('captains-log')();
var fs = require('fs');
var utf8 = require('utf8');
const prettier = require("prettier");
var pretty = require('pretty');

function Updater(path) {

this.path = path;
this.canQuery = true;
}

Updater.prototype.verify_git = function()
{
  path = this.path;
  timed_check(path);
}

function timed_check(path)
{

  setTimeout(function(){

    shell_exec(path , 'git fetch &&  git diff-index --quiet FETCH_HEAD -- || echo "untracked"', false);

   }, 1000);
}

function work_on_response(response,path)
{

    //wow
  if(response.trim() == '"untracked"')
  {
    log.info(path + 'git reset --hard && git pull origin master')
    shell_exec(path , ' git reset --hard && git pull origin master', true);
  }
  else
  {
    log.info('no need to update');
  }
}

function shell_exec(path, command, stop)
{
  exec(path + command , function(error, stdout, stderr) {

    if (typeof error != null) {

      work_on_response(stdout,path);

    }
    if(stop === false)
    {
      timed_check(path);
    }

  });
}
