import OpenAI from "openai"

const openai = new OpenAI(
    {
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    }
)

/* Upload training data */
// const file = await openai.files.create({
    // file: await fetch('motivationalBotData.jsonl'),
    // purpose: 'fine-tune'
// })
// 
// console.log(file)
// file-PGoch47trGzoGFpQTRqrMJ

/* Use file ID to create job */
// const fineTune = await openai.fineTuning.jobs.create({
    // training_file: 'file-PGoch47trGzoGFpQTRqrMJ',
    // model: 'gpt-3.5-turbo'
// })
// 
// console.log(fineTune)
// ftjob-itOTLPW0hhuqDVl0obkBMp37

/* Check status of job */
// const fineTuneStatus = await openai.fineTuning.jobs.retrieve('ftjob-itOTLPW0hhuqDVl0obkBMp37')
// console.log(fineTuneStatus)
// ft:gpt-3.5-turbo-0125:personal::AdYMeAwv

/* Test our fine-tuned model */ 
    const messages = [
        {
            role: 'user',
            content: "I don't know what to do with my life and being underpaid"
        }
    ]

async function getResponse() {
    const response = await openai.chat.completions.create({
        model: 'ft:gpt-3.5-turbo-0125:personal::AdYMeAwv',
        messages
    })
    console.log(response.choices[0].message.content)
}

getResponse()
