'use strict';

module.exports = {
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

  // todo: integrate later
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

  issue: {
    fix: {
      name: 'mantis',
      message: 'Mantis #',
      link: 'https://mantis.fortinet.com/bug_view_page.php?bug_id=###'
    }
  },

  body: {
    fix: {
      symptom: {
        prefix: 'Problem Description: ',
        message: 'Describe Symptom, Reproduce Steps (optional). Use "|" to break new line:\n ',
      },

      solution: {
        prefix: 'Solution Description: ',
        message: 'Describe Root Cause, and Diagnose Info (optional). Use "|" to break new line:\n ',
      },

      detail: {
        prefix: 'Technical Detail: ',
        message: 'Detailed Information (optional). Use "|" to break new line:\n',
      }
    }
  }
};
