import OpenAI from "openai"
import * as tools from "./tools"

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

/**
 * Goal - build an agent that can answer any questions that might require knowledge about my current location and the current weather at my location.
 */

/**
 PLAN:
 1. Design a well-written ReAct prompt
 2. Build a loop for my agent to run in.
 3. Parse any actions that the LLM determines are necessary
 4. End condition - final Answer is given
 
 */

const systemPrompt = `
You cycle through Thought, Action, PAUSE, Observation. At the end of the loop you output a final Answer. If you think is it sufficient to formulate answer, please do not provide action. Your final answer should be highly specific to the observations you have from running the actions.
1. Thought: Describe your thoughts about the question you have been asked.
2. Action: run one of the actions available to you - then return PAUSE.
3. PAUSE
4. Observation: will be the result of running those actions.

Available actions:
- getCurrentWeather: 
    E.g. getCurrentWeather: Salt Lake City
    Returns the current weather of the location specified.
- getLocation:
    E.g. getLocation: null
    Returns user's location details. No arguments needed.

Example session:
Question: Please give me some ideas for activities to do this afternoon.
Thought: I should look up the user's location so I can give location-specific activity ideas.
Action: getLocation: null
PAUSE

You will be called again with something like this:
Observation: "New York City, NY"

Then you loop again:
Thought: To get even more specific activity ideas, I should get the current weather at the user's location.
Action: getCurrentWeather: New York City
PAUSE

You'll then be called again with something like this:
Observation: { location: "New York City, NY", forecast: ["sunny"] }

You then output:
Answer: <Suggested activities based on sunny weather that are highly specific to New York City and surrounding areas.>

Example session:
Question: Please help me

You then output:
Answer: Yes, i can recommend activities based on your location and weather to help you
`

async function agent(query) {
    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
    ]
    const MAX_ITERATIONS = 5
    
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages
        })
        const responseText = response.choices[0].message.content
        messages.push({ role: 'assistant', content: responseText })
    
        const split = responseText.split('\n')
        const action = split.find(str => /^Action: (\w+): (.*)$/.test(str))
        if (action) {
            const [_, fn, param] = action.split(': ')
            if (!tools[fn]) throw new Error(`Function or tool ${fn}(${param}) not available`)
            const value = await tools[fn](param)
            messages.push({ role: 'assistant', content: "Observation: " + value })
        } else {
            return responseText
        }
    }
}

console.log(await agent("What are some activity ideas that I can do this afternoon based on my location and weather?"))