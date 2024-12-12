import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

const startButton = document.getElementById("start")
const contentEl = document.getElementById("content")
const questionSection = document.getElementById("question")

function initQuestion() {
    const incrementButton = document.getElementById("increment")
    const decrementButton = document.getElementById("decrement")
    const count = document.getElementById("count")
    const submitButton = document.getElementById("submit")
    const resultSection = document.getElementById("result")

    incrementButton.addEventListener("click", () => {
        count.innerText = parseInt(count.innerText) + 1
    })

    decrementButton.addEventListener("click", () => {
        count.innerText = parseInt(count.innerText) - 1
    })

    submitButton.addEventListener("click", () => {
         contentEl.innerHTML = resultSection.innerHTML
    })
}

startButton.addEventListener("click", () => {
    contentEl.innerHTML = questionSection.innerHTML
    initQuestion()
})
