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

    shell_exec(path + ' git diff-index --quiet HEAD -- || echo "untracked"; ')
    log.info(path + ' git status && git diff-index --quiet HEAD -- || echo "untracked"; ');
    timed_check(path);

   }, 1000);
}

function shell_exec(command,file,response,func)
{
  exec(command , function(error, stdout, stderr) {

    if (typeof error != null) {

        log.info(stdout)
    }
  });
}
