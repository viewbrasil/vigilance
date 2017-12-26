module.exports = Updater;
var utilities = require('../helpers/utils.js');
var utils = new utilities;
var exec = require('child_process').exec;
var log = require('captains-log')();
var fs = require('fs');
var utf8 = require('utf8');
const prettier = require("prettier");
var pretty = require('pretty');
const isOnline = require('is-online');
var lostConnection = false;

function Updater() {

}

Updater.prototype.verify_git = function(path,branch)
{
check_connection(path,branch);
}

function check_connection(path,branch)
{
  isOnline().then(online => {

    if(online == true)
    {
      if(lostConnection == true)
      {
        log.info('Connection restablished.');
        lostConnection = false;
      }
      timed_check(path,branch);
    }
    else {

    setTimeout(function(){

      log.info('Connection lost. Trying again in 3 seconds.');
      lostConnection = true;
      check_connection(path,branch)

    }, 3000);
    }

  });
}


function timed_check(path,branch)
{
    shell_exec(path , 'git fetch &&  git diff-index --quiet FETCH_HEAD -- || echo "untracked"', false,branch);
}

function work_on_response(response,path,stop,branch)
{

    if(response.trim() == '"untracked"')
    {
      log.info('updating local files..');
      shell_exec(path , ' git reset --hard origin/'+branch+' && git pull origin ' + branch + ' && pm2 stop start.js && pm2 start start.js', true,branch);
    }
    else {
      if(stop == true)
      {
        log.info('Update successful');
      }
      check_connection(path,branch);
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
