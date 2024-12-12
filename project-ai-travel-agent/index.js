import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

async function agent(query) {
    const messages = [
        {
            role: 'system',
            content: "You are a helpful AI Travel agent. Give highly specific trip plan based on the information you're provided and gather with the tools provided to you. Remember to use information creatively, e.g more people on the trip different for solo trip. The trip plan should have 1. weather condition 2. activities 3. flight plan 4. hotel plan about the trip itself"
        },
        {
            role: 'user',
            content: query
        }
    ]

    const functions = [
    {
        function: getCurrentWeather,
        parameters: {
            type: "object",
            properties: {
                location: {
                    type: "string",
                    description: "The location from where to get the weather"
                }
            },
            required: ["location"]
        }
    }
]

    const runner = openai.beta.chat.completions.runFunctions({
        model: "gpt-3.5-turbo-1106",
        messages,
        functions
    })

    const final = await runner.finalContent()
    return final
}

const startButton = document.getElementById("start")
const contentEl = document.getElementById("content")
const questionSection = document.getElementById("question")

async function initResult(flyingFrom, flyingTo, fromDate, toDate, budget, count) {
    const startDateEl = document.getElementById("info-start-date")
    const endDateEl = document.getElementById("info-end-date")
    const placeEl = document.getElementById("info-place")
    const weatherEl = document.getElementById("info-weather")
    const flightEl = document.getElementById("info-flight")
    const hotelEl = document.getElementById("info-hotel")
    startDateEl.textContent = "->" + formatDate(fromDate)
    endDateEl.textContent = formatDate(toDate) + "<-"
    placeEl.textContent = flyingTo + " -> " + flyingFrom
    const prompt = `from ${flyingFrom} to ${flyingTo}, start ${fromDate} until ${toDate} with ${count} people(s) and ${budget}$ trip budget`
    const agentResponse = await agent(prompt)
    const [ weather, activies, flight, hotel ] = agentResponse.split('\n')
    weatherEl.textContent = weather + ". Here activities you can do: " + activies
    flightEl.textContent = flight
    hotelEl.textContent = hotel
}

function initQuestion() {
    const incrementButton = document.getElementById("increment")
    const decrementButton = document.getElementById("decrement")
    const count = document.getElementById("count")
    const flyingFrom = document.getElementById("from")
    const flyingTo = document.getElementById("to")
    const fromDate = document.getElementById("from-date")
    const toDate = document.getElementById("to-date")
    const budget = document.getElementById("budget")
    const submitButton = document.getElementById("submit")
    const resultSection = document.getElementById("result")

    incrementButton.addEventListener("click", () => {
        count.innerText = parseInt(count.innerText) + 1
    })

    decrementButton.addEventListener("click", () => {
        count.innerText = parseInt(count.innerText) - 1
    })

    submitButton.addEventListener("click", () => {
        if (!flyingFrom.value || !flyingTo.value || !fromDate.value || !toDate.value || !budget.value) {
            alert("Please fill in all fields")
            return
        }
         contentEl.innerHTML = resultSection.innerHTML
        initResult(flyingFrom.value, flyingTo.value, fromDate.value, toDate.value, budget.value, count.innerText)
    })
}

startButton.addEventListener("click", () => {
    contentEl.innerHTML = questionSection.innerHTML
    initQuestion()
})


async function getCurrentWeather({ location }) {
    // TODO: using real weather API
    const weather = {
        location,
        temperature: "75",
        forecast: "sunny"
    }
    return JSON.stringify(weather)
}

async function createHotelBooking({ price, stay }) {
    const booking = {
        location: 'Ayana Hotel Bali',
        price,
        stay
    }
    return JSON.stringify(booking)
}

async function createFlightBooking({ startDate, endDate, from, to }) {
    const flight = [{ from, to, startDate }, {to, from, endDate}]
    return JSON.stringify(flight)
}

function formatDate(inputDate) {
    // Parse the input date
    const date = new Date(inputDate);

    // Get day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);

    // Determine the day suffix
    const suffix = (day % 10 === 1 && day !== 11) ? 'st'
                  : (day % 10 === 2 && day !== 12) ? 'nd'
                  : (day % 10 === 3 && day !== 13) ? 'rd'
                  : 'th';

    // Format and return the date
    return `${day}${suffix} ${month} ${year}`;
}
