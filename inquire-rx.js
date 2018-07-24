// run with `node infinite.js` in node v4.x+
// must have Inquirer installed (`npm install inquirer`)

const inquirer = require('inquirer');
const Rx = require('rx');

const prompts = new Rx.Subject();

// todo: import question template and iterate 
function makePrompt(msg) {
  return {
    type: 'input',
    name: `userInput-${i}`,
    message: `${msg || 'Say something to start chatting!'}\n\n`,
  };
}

let i = 0;

inquirer.prompt(prompts).ui.process.subscribe(({ answer, name }) => {
  if (answer !== '') {
    i += 1;
    console.log(`answer is ${name} : ${answer} \n`);
    prompts.onNext(makePrompt(`This is prompt #${i}.`));
  } else {
    prompts.onCompleted();
  }
}, (err) => {
  console.warn(err);
}, () => {
  console.log('Interactive session is complete. Good bye! 👋\n');
})

prompts.onNext(makePrompt());