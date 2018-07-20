'use strict';

module.exports = {
  entry: {
    fix: {
      value: 'fix',
      name: 'fix a bug',
      scope: {
        custom: true,
        message: 'scopes'
      },
      subject: {
        message: 'Subject:'
      },
      body: {
        /* 
         * split the body to multiple parts (symptom, solution, detail ) for question
         */
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
        },

        message: 'Additional Information:'
      },
    }
  },
  // scopes: [
  //   {name: 'accounts'},
  //   {name: 'admin'},
  //   {name: 'exampleScope'},
  //   {name: 'changeMe'}
  // ],

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [

      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },
  */
  // override the messages, defaults are as follows
  
  messages: {
    symptom: 'Problem Description: ',
    solution: 'Solution Description: ',
    detail: 'Technical Detail: ',
  },
  
  allowCustomScopes: true
};
