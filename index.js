'use strict';

// Inspired by: https://github.com/commitizen/cz-conventional-changelog and https://github.com/commitizen/cz-cli

var CZ_CONFIG_NAME = '.cz-config.js';
var CZ_CONFIG_EXAMPLE_LOCATION = './cz-config-EXAMPLE.js';
var findConfig = require('find-config');
var log = require('winston');
var editor = require('editor');
var temp = require('temp').track();
var fs = require('fs');
var path = require('path');
var buildCommit = require('./buildCommit');
var messages = {};

/* istanbul ignore next */
function readConfigFile() {

  // First try to find the .cz-config.js config file
  var czConfig = findConfig.require(CZ_CONFIG_EXAMPLE_LOCATION, { home: false });
  if (czConfig) {
    return czConfig;
  }

  // fallback to locating it using the config block in the nearest package.json
  var pkg = findConfig('package.json', { home: false });
  if (pkg) {
    var pkgDir = path.dirname(pkg);
    pkg = require(pkg);

    if (pkg.config && pkg.config['cz-customizable'] && pkg.config['cz-customizable'].config) {
      // resolve relative to discovered package.json
      var pkgPath = path.resolve(pkgDir, pkg.config['cz-customizable'].config);

      console.info('>>> Using cz-customizable config specified in your package.json: ', pkgPath);

      return require(pkgPath);
    }
  }

  log.warn('Unable to find a configuration file. Please refer to documentation to learn how to ser up: https://github.com/leonardoanalista/cz-customizable#steps "');
}



function makeChoice(config) {
  return {
    type: 'list',
    name: 'type',
    message: config.messages.type,
    choices: config.types
  };
}

function makeScope(config) {
  return {
    type: 'input',
    name: 'scope',
    message: config.messages.scope
  }
}

function makeSubject(config) {
  return {
    type: 'input',
    name: 'subject',
    message: config.messages.subject
  }
}

function makeTracker(issue) {
  return {
    type: 'input',
    name: 'issue',
    message: issue.message || 'no message',
  }
}

function makeDefault(name) {
  return {
    type: 'input',
    name: name,
    message: messages[`${name}`]
  }
}

function makeBody(name, v) {
  return {
    type: 'input',
    name: `body.${name}`,
    message: v.message,
    filter(val) {
      if (!val.trim()) return "";
      var content = '';
      content = content.concat(v.prefix ? v.prefix.concat('|\t') : '')
      content = content.concat(val)
      content = content.concat(v.postfix ? v.postfix : '|')
      // wrap the content with prefix and postfix in config 
      return content
    }
  }
}

function makeConfirm(config) {
  return {
    type: 'expand',
    name: 'confirmCommit',
    choices: [
      { key: 'y', name: 'Yes', value: 'yes' },
      { key: 'n', name: 'Abort commit', value: 'no' },
      { key: 'e', name: 'Edit message', value: 'edit' }
    ],
    message: function (answers) {
      // fixme: can use the answer set, but body is overwritten.
      var SEP = '###--------------------------------------------------------###';
      log.info('\n' + SEP + '\n' + buildCommit(answers, config) + '\n' + SEP + '\n');
      return config.messages.confirmCommit;
    },
    when: function (answers) {
      return true;
    }
  }
}

module.exports = {
  prompter: function (cz, commit) {
    var config = readConfigFile();
    const Rx = require('rx');

    const prompts = new Rx.Subject();

    log.info('\n\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n');

    messages = config.messages || {};

    messages.type = messages.type || 'Select the type of change that you\'re committing:';
    messages.scope = messages.scope || '\nDenote the SCOPE of this change (optional):';
    messages.customScope = messages.customScope || 'Denote the SCOPE of this change:';
    messages.subject = messages.subject || 'Write a SHORT, IMPERATIVE tense description of the change:\n';
    messages.body = messages.body || 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n';
    messages.breaking = messages.breaking || 'List any BREAKING CHANGES (optional):\n';
    messages.footer = messages.footer || 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n';
    messages.confirmCommit = messages.confirmCommit || 'Are you sure you want to proceed with the commit above?';

    var promise = cz.prompt(prompts);

    promise.then(answers => {
      if (answers.confirmCommit === 'edit') {
        temp.open(null, function (err, info) {
          /* istanbul ignore else */
          if (!err) {
            fs.write(info.fd, buildCommit(answers, config));
            fs.close(info.fd, function (err) {
              editor(info.path, function (code, sig) {
                if (code === 0) {
                  var commitStr = fs.readFileSync(info.path, { encoding: 'utf8' });
                  commit(commitStr);
                } else {
                  log.info('Editor returned non zero value. Commit message was:\n' + buildCommit(answers, config));
                }
              });
            });
          }
        });
      } else if (answers.confirmCommit === 'yes') {
        commit(buildCommit(answers, config));
      } else {
        log.info('Commit has been canceled.');
      }
    });

    promise.ui.process.subscribe(({ answer, name }) => {
      // todo: add new prompt for issue tracker based on config 
      // todo: build ref in footer part as issue link
      if (name === 'type') {
        if (config.issue)
          prompts.onNext(makeTracker(config.issue[answer]));
        if (config.body.hasOwnProperty(answer)) {
          var template = config.body[answer];
          Object.keys(template).forEach(function (name) {
            prompts.onNext(makeBody(name, template[name]));
          });
        } else {
          prompts.onNext(makeDefault('body'));
        }
        prompts.onNext(makeDefault('footer'));
        prompts.onNext(makeConfirm(config));
        prompts.onCompleted();
      }

    }, (err) => {
      console.warn(err);
    }, () => { })

    prompts.onNext(makeChoice(config));
    prompts.onNext(makeScope(config));
    prompts.onNext(makeSubject(config));
  }
};


