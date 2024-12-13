import "poplog"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

async function agent(query) {
    const messages = [
        {
            role: 'system',
            content: `You are a helpful AI Travel agent. Give highly specific trip plan based on the information you're provided. Prefer to gather information with the tools provided to you rather than giving basic, generic answers. for example, using getCurrentWeather to get weather information. Remember to use information creatively, e.g more people on the trip different for solo trip. Always follow this exact format example: "
            You can expect the weather to be quite mild. Low will be 19deg and high will be 25deg
            ###
            Here is some activities 1. Playing football in the field 2. Visit prambanan temple with ticket discount 3. Go to Malioboro street to seek street food and beutiful city condition
            ###
            The best option for you is with Delta Airlines with a layover is Oslo
            ###
            The best option for you is the Hilton Hotel. It is a 5-star hotel with a rating of 4.5. The price is $200 per night

            "`
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
    },
    {
        function: createHotelBooking,
        parameters: {
            type: "object",
            properties: {
                price: {
                    type: "string",
                    description: "The price of hotel booking"
                },
                stay: {
                    type: "string",
                    description: "How long to stay in the hotel"
                }
            },
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

async function generateDestinationImage(dest) {
    const response = await openai.images.generate({
        model: 'dall-e-2',
        prompt: dest,
        size: '256x256'
    })

    return response.data[0].url
}

const startButton = document.getElementById("start")
const contentEl = document.getElementById("content")
const questionSection = document.getElementById("question")

async function initResult(flyingFrom, flyingTo, fromDate, toDate, budget, count) {
    const resultSection = document.getElementById("result")
    contentEl.innerHTML = 'Yahoo, generating your plan trip!'
    const prompt = `from ${flyingFrom} to ${flyingTo}, start ${fromDate} until ${toDate} with ${count} people(s) and ${budget}$ trip budget`
    const agentResponse = await agent(prompt)
    const imageUrl = await generateDestinationImage(flyingTo)
    contentEl.innerHTML = resultSection.innerHTML

    const startDateEl = document.getElementById("info-start-date")
    const endDateEl = document.getElementById("info-end-date")
    const placeEl = document.getElementById("info-place")
    const imageEl = document.getElementById("info-image")
    const weatherEl = document.getElementById("info-weather")
    const activitiesEl = document.getElementById("info-activities")
    const flightEl = document.getElementById("info-flight")
    const hotelEl = document.getElementById("info-hotel")
    startDateEl.textContent = "->" + formatDate(fromDate)
    endDateEl.textContent = formatDate(toDate) + "<-"
    placeEl.textContent = flyingFrom + " -> " + flyingTo
    const [weather, activities, flight, hotel] = agentResponse.split('###')
    weatherEl.textContent = weather
    imageEl.setAttribute('src', imageUrl)
    activitiesEl.textContent = activities
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
        initResult(flyingFrom.value, flyingTo.value, fromDate.value, toDate.value, budget.value, count.innerText)
    })
}

startButton.addEventListener("click", () => {
    contentEl.innerHTML = questionSection.innerHTML
    initQuestion()
})


async function getCurrentWeather({ location }) {
    // TODO: using real weather API
    console.log('running getCurrentWeather')
    const weather = {
        location,
        temperature: "75",
        forecast: "sunny"
    }
    return JSON.stringify(weather)
}

async function createHotelBooking({ price, stay }) {
    // TODO: get real create booking action
    console.log('running createHotelBooking')
    const booking = {
        location: 'Ayana Hotel Bali',
        price,
        stay
    }
    return JSON.stringify(booking)
}

export async function createFlightBooking({ startDate, endDate, from, to }) {
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
