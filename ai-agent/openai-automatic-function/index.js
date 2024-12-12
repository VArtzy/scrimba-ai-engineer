import OpenAI from "openai"
import { functions } from "./tools"

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

async function agent(query) {
    const messages = [
        { role: "system", content: "You are a helpful AI agent. Give highly specific answers based on the information you're provided. Prefer to gather information with the tools provided to you rather than giving basic, generic answers." },
        { role: "user", content: query }
    ]

    const runner = openai.beta.chat.completions.runFunctions({
        model: "gpt-3.5-turbo-1106",
        messages,
        functions
    }).on("message", (message) => console.log(message))
    
    const finalContent = await runner.finalContent()
    console.log(finalContent)
}

await agent("What's the current weather in my current location?")

/**
The current weather in New York is sunny with a temperature of 75°F.
 */
