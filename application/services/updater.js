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

}

Updater.prototype.verify_git = function()
{
  path = this.path;
  timed_check(path);
}

function timed_check(path)
{
  setTimeout(function(){

    shell_exec(path , ' git diff-index --quiet HEAD -- || echo "untracked"');
    timed_check(path);

   }, 1000);
}

function work_on_response(response,path)
{

    //wow
  if(response.trim() == '"untracked"')
  {
    log.info(path + 'git reset --hard && git pull origin master')
    shell_exec(path , ' git reset --hard && git pull origin master');
  }
}

function shell_exec(path, command)
{
  exec(path + command , function(error, stdout, stderr) {

    if (typeof error != null) {

      work_on_response(stdout,path);

    }
  });
}
