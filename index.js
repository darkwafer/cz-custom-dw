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

function makeBody(name, v) {
  if (!name) {
    return {
      type: 'input',
      name: `body`,
      message: "default body"
    }
  }
  return {
    type: 'input',
    name: `body.${name}`,
    message: v.message,
    filter(val) {
      var content = '';
      content = content.concat(v.prefix ? v.prefix.concat('|\t') : '')
      content = content.concat(val)
      content = content.concat(v.postfix ? v.postfix : '\n')
      // wrap the content with prefix and postfix in config 
      return content
    }
  }
}

function makeFooter(config) {
  return {
    type: 'input',
    name: 'footer',
    message: config.messages.footer
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

    cz.prompt(prompts).ui.process.subscribe(({ answer, name }) => {
      console.log(`answer is ${name} : ${answer}`);
      if (name === 'type') {
        if (config.body.hasOwnProperty(answer)) {
          console.log('Build Body Template')
          var template = config.body[answer];
          Object.keys(template).forEach(function (name) {
            prompts.onNext(makeBody(name, template[name]));
          });
        } else {
          prompts.onNext(makeBody());
        }
        prompts.onNext(makeFooter(config));
        prompts.onNext(makeConfirm(config));
        prompts.onCompleted();
      }
    }, (err) => {
      console.warn(err);
    }, () => {
      console.log('Interactive session is complete. Good bye!');
    })

    prompts.onNext(makeChoice(config));
    prompts.onNext(makeScope(config));
    prompts.onNext(makeSubject(config));
  }
};


