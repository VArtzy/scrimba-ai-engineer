import { getChatCompletion, findNearestMatch, createEmbedding } from './util.js'

const buttonEl = document.getElementById('submit')
const errorEl = document.getElementById('error')
const mainEl = document.querySelector('main')
const mainCopy = mainEl.cloneNode(true)

function renderRecommendation(match, recommend) {
    const heading = document.createElement('h2')
    heading.textContent = `${match.title} (${match.year})`
    mainEl.innerHTML = null
    mainEl.appendChild(heading)
    mainEl.append(recommend)
    buttonEl.textContent = 'Go Again'
}

async function generateRecommendation(query) {
    errorEl.textContent = ''
    buttonEl.textContent = 'Generate...'

    const embedding = await createEmbedding(query)
    const match = await findNearestMatch(embedding)
    const recommend = await getChatCompletion(match.content, query)
    return { match, recommend }
}

buttonEl.addEventListener('click', async () => {
    if (buttonEl.textContent === 'Go Again') {
        mainEl.innerHTML = mainCopy.innerHTML
        buttonEl.textContent = `Let's Go`
        errorEl.textContent = ''
        return
    }

    const favorite = document.getElementById('favorite').value
    const mood = document.getElementById('mood').value
    const serious = document.getElementById('serious').value
    if (!favorite || !mood || !serious) {
        errorEl.textContent = 'Please fill all the questions to create acurrate movie recommendation!'
        return
    }

    const query = `${mood} and ${serious}. My favorite movie is ${favorite}`
    const { match, recommend } = await generateRecommendation(query)

    renderRecommendation(match, recommend)
})
