module.exports = Updater;
var exec = require("child_process").exec;
var log = require("captains-log")();
const isOnline = require("is-online");
var lostConnection = false;
var commands = null;

function Updater() {}
//kakaka
Updater.prototype.verify_git = function(path, branch, command) {
  commands = command;
  check_connection(path, branch);
};

function check_connection(path, branch) {
  isOnline().then(online => {
    if (online == true) {
      if (lostConnection == true) {
        log.info("Connection restablished.");
        lostConnection = false;
      }
      timed_check(path, branch);
    } else {
      setTimeout(function() {
        log.info("Connection lost. Trying again in 3 seconds.");
        lostConnection = true;
        check_connection(path, branch);
      }, 3000);
    }
  });
}

function timed_check(path, branch) {
  shell_exec(
    path,
    'git fetch &&  git diff-index --quiet FETCH_HEAD -- || echo "untracked"',
    false,
    branch
  );
}

function work_on_response(response, path, stop, branch) {
  if (response.trim() == '"untracked"') {
    log.info("updating local files..");
    exec_str =
      " git reset --hard origin/" + branch + " && git pull origin " + branch;
    if (commands !== null) {
      commands.forEach(function(object, index) {
        log.info("running " + object);
        exec_str = exec_str + " && " + object;
      });
    }
    shell_exec(path, exec_str, true, branch);
  } else {
    if (stop == true) {
      log.info("Update successful");
    }
    check_connection(path, branch);
  }
}

function shell_exec(path, command, stop, branch) {
  exec(path + command, function(error, stdout, stderr) {
    if (typeof error != null) {
      work_on_response(stdout, path, stop, branch);
    }
  });
}