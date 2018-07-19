'use strict';

// 配置用例基于下述提交准则

// #### 解决Bug的代码提交
// - 第一句描述解决了什么问题
// - 第二句描述引入这个问题的原因。
// - 第三句简述解决方案。
// - 最后一句描述代码影响范围（可选）

// #### 新增功能的代码提交
// - Add:新增了什么模块，简述这个模块是做什么用的。
// - Delete: 删除了什么模块，简述为什么删除。
// - Change: 修改了什么模块，简述为什么修改。

// #### 重构功能的代码提交
// - 重构功能的代码提交
// - Refactor：重构了什么代码模块，简述为什么重构。

// #### 测试的代码提交
// - 测试的代码提交
// - Test：简述增加某个模块的测试用例。

module.exports = {
  entry: {
    Fix: {
      value: 'Fix',
      name: 'Fix:    Fix a bug',
      scope: {
        custom: true,
        message: 'scopes'
      },
      subject: {
        message: 'Sub'
      },
      desc: {
        message: 'Solution Description: ',
      },
      footer: {
        prefix: 'Technical Detail: ',
        message: 'Detailed information'
      }
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
    type: 'choose commit type:',
    confirmCommit: 'confirm to commit?'
  },
  allowCustomScopes: true
};
