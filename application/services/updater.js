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

Updater.prototype.verify_git = function(path,branch)
{
  timed_check(path,branch);
}


function timed_check(path,branch)
{
    shell_exec(path , 'git fetch &&  git diff-index --quiet FETCH_HEAD -- || echo "untracked"', false,branch);
    //console.log(path , 'git fetch &&  git diff-index --quiet FETCH_HEAD -- || echo "untracked"');
}

function work_on_response(response,path,stop,branch)
{

    if(response.trim() == '"untracked"')
    {
      log.info('updating local files..');
      shell_exec(path , ' git reset --hard origin/'+branch+' && git pull origin ' + branch, true,branch);
      //console.log(path , ' git reset --hard origin/'+branch+' && git pull origin ' + branch)
    }
    else {
      if(stop == true)
      {
        log.info('Update successful');
      }
      timed_check(path,branch);
    }

}

function shell_exec(path, command, stop,branch)
{
  exec(path + command , function(error, stdout, stderr) {

    if (typeof error != null) {

      work_on_response(stdout,path,stop,branch);

    }
  });
}
