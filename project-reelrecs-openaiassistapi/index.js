import { openai } from './config.js'

const form = document.querySelector('form')
const input = document.querySelector('input')
const reply = document.querySelector('.reply')

// Assistant variables
const asstID = import.meta.env.VITE_ASST_ID
const threadID = import.meta.env.VITE_THREAD_ID

form.addEventListener('submit', function(e) {
  e.preventDefault()
  main()
  input.value = ''
})

// Bring it all together
async function main() {
    reply.innerHTML = 'Thinking...'

    await createMessage(input.value)

    const run = await runThread()
    let currRun = await retrieveRun(threadID, run.id)
    while (currRun.status !== 'completed') {
        await new Promise(res => setTimeout(res, 2000))
        currRun = await retrieveRun(threadID, run.id)
    }

    const { data } = await listMessages()
    reply.innerHTML = data[0].content[0].text.value
}

/* -- Assistants API Functions -- */

// Create a thread
export async function createThread() {
    const thread = await openai.beta.threads.create()
    console.log(thread)
}

// Create a assistant
export async function createAssistant() {
    const assistance = await openai.beta.assistants.create({
        instructions: 'You are great professional financial advisor. When asked a question, use the information in the provided file and your knowledge to form a visionary response. If you cannot answer, do your best infer the answer should be.',
        name: 'Financial Advisor',
        tools: [{ type: 'retrieval' }],
        model: 'gpt-4-1106-preview',
        file_ids: ['file-PXZv4gVpbRdBricbVrtob9']
    })

    console.log(assistance)
}

// Upload file with an "assistants" purpose
export async function createFile() {
    const file = await openai.files.create({
        file: await fetch('/financeAdvice.txt'),
        purpose: 'assistants'
    })

    console.log(file)
    // file-PXZv4gVpbRdBricbVrtob9
}

// Create a message
async function createMessage(question) {
  const threadMessages = await openai.beta.threads.messages.create(
    threadID,
    { role: "user", content: question }
  )
    return threadMessages
}

// Run the thread / assistant
async function runThread() {
  const run = await openai.beta.threads.runs.create(
    threadID, { assistant_id: asstID }
  )
  return run
}

// List thread Messages
async function listMessages() {
  return await openai.beta.threads.messages.list(threadID)
}

// Get the current run
async function retrieveRun(thread, run) {
  return await openai.beta.threads.runs.retrieve(thread, run)
}
