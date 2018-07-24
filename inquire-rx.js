// run with `node infinite.js` in node v4.x+
// must have Inquirer installed (`npm install inquirer`)
var buildCommit = require('./buildCommit');
var log = require('winston');

var config = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
    { value: 'style', name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)' },
    { value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature' },
    { value: 'perf', name: 'perf:     A code change that improves performance' },
    { value: 'test', name: 'test:     Adding missing tests' },
    { value: 'chore', name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation' },
    { value: 'revert', name: 'revert:   Revert to a commit' },
    { value: 'WIP', name: 'WIP:      Work in progress' }
  ],

  scopes: [
    { name: 'accounts' },
    { name: 'admin' },
    { name: 'exampleScope' },
    { name: 'changeMe' }
  ],

  messages: {
    type: 'Select the type of change that you\'re committing:',
    scope: 'Denote the SCOPE of this change (optional):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?'
  },


  body: {
    fix: {
      symptom: {
        prefix: 'Problem Description: ',
        message: 'Symptom: ',
      },

      solution: {
        prefix: 'Solution Description: ',
        message: 'Solution: ',
      },

      detail: {
        prefix: 'Technical Detail: ',
        message: 'Details: ',
      }
    }
  }
}



const inquirer = require('inquirer');
const Rx = require('rx');

const prompts = new Rx.Subject();

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

inquirer.prompt(prompts).ui.process.subscribe(({ answer, name }) => {
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

