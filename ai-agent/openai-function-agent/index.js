import OpenAI from "openai"
import { getCurrentWeather, getLocation, tools } from "./tools"

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

const availableFunctions = {
    getCurrentWeather,
    getLocation
}

async function agent(query) {
    const messages = [
        { role: "system", content: "You are a helpful AI agent. Give highly specific answers based on the information you're provided. Prefer to gather information with the tools provided to you rather than giving basic, generic answers." },
        { role: "user", content: query }
    ]

    const MAX_ITERATIONS = 5

    for (let i = 0; i < MAX_ITERATIONS; i++) {
        console.log(`Iteration #${i + 1}`)
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages,
            tools
        })

        const { finish_reason: finishReason, message } = response.choices[0]
        const { tool_calls: toolCalls } = message
        console.log(toolCalls)
        
        messages.push(message)
        
        if (finishReason === "stop") {
            console.log(message.content)
            console.log("AGENT ENDING")
            return
        } else if (finishReason === "tool_calls") {
            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name
                const functionToCall = availableFunctions[functionName]
                const functionArgs = JSON.parse(toolCall.function.arguments)
                const functionResponse = await functionToCall(functionArgs)
                console.log(functionResponse)
                messages.push({
                    tool_call_id: toolCall.id,
                    role: "tool",
                    name: functionName,
                    content: functionResponse
                })
            }
        }
    }
}

await agent("Please help me")

/**
Iteration #1
›[{id: "call_KFL8fg27lGCqWQINPb4jHeXE", type: "function", function: {name: "getLocation", arguments: "{}"}}]
›{"ip":"194.60.86.110","network":"194.60.86.0/24","version":"IPv4","city":"Salt Lake City","region":"Utah","region_code":"UT","country":"US","country_name":"United States","country_code":"US","country_code_iso3":"USA","country_capital":"Washington","country_tld":".us","continent_code":"NA","in_eu":false,"postal":"84111","latitude":40.7605,"longitude":-111.8884,"timezone":"America/Denver","utc_offset":"-0700","country_calling_code":"+1","currency":"USD","currency_name":"Dollar","languages":"en-US,es-US,haw,fr","country_area":9629091,"country_population":327167434,"asn":"AS13213","org":"UK-2 Limited"}
›Iteration #2
›[{id: "call_ciFzBqUmia2eJDQKZiiGQeVK", type: "function", function: {name: "getCurrentWeather", arguments: "{"location":"Salt Lake City, UT"}"}}]
›{"location":"Salt Lake City, UT","temperature":"75","forecast":"sunny"}
›Iteration #3
›undefined
›The current weather in Salt Lake City, UT is sunny with a temperature of 75°F.
›AGENT ENDING
/index.html


 */