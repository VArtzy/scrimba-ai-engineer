import { openai } from './config.js';

const form = document.querySelector('form');
const input = document.querySelector('input');
const reply = document.querySelector('.reply');

// Assistant variables
const asstID = "asst_AlAOsigm1nQkGnahv2eMJBdK";
const threadID = "thread_XBZNFmOmZvmVWrIHCIfWBU2x";

form.addEventListener('submit', function(e) {
  e.preventDefault();
  main();
  input.value = '';
});

// Bring it all together
async function main() {
  reply.innerHTML = 'Thinking...';

}

/* -- Assistants API Functions -- */

// Create a message
async function createMessage(question) {
  const threadMessages = await openai.beta.threads.messages.create(
    threadID,
    { role: "user", content: question }
  );
}

// Run the thread / assistant
async function runThread() {
  const run = await openai.beta.threads.runs.create(
    threadID, { assistant_id: asstID }
  );
  return run;
}

// List thread Messages
async function listMessages() {
  return await openai.beta.threads.messages.list(threadID)
}

// Get the current run
async function retrieveRun(thread, run) {
  return await openai.beta.threads.runs.retrieve(thread, run);
}