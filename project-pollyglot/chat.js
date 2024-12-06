import OpenAI from "https://cdn.jsdelivr.net/npm/openai@latest/+esm"

const inputEl = document.getElementById('input')
const langEl = document.getElementsByName('lang')
const buttonEl = document.getElementById('translate')
const errorEl = document.getElementById('error')
const chatEl = document.getElementById('chat')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

async function translate(input, lang) {
    const messages = [
            {
                'role': 'system',
                'content': 'You are contextual translator, provide only translation'
            },
            {
                'role': 'user',
                'content': `"${input}" in ${lang}`
            }
        ]
    try {
        const response = await openai.chat.completions.create({
            'model': 'gpt-3.5-turbo',
            messages
        })
        return response.choices[0].message.content
    } catch (err) {
        errorEl.textContent = "Sorry, you can try access PollyGlot later..."
        return
    }
}

function appendChat(translate) {
    if (translate) {
        const botDiv = document.createElement('div')
        botDiv.classList.add('bot')
        botDiv.textContent = translate
        chatEl.appendChild(botDiv)
        errorEl.textContent = ''
    }
    buttonEl.textContent = '>'
}

function radioValue() {
    for (const radioButton of langEl) if (radioButton.checked) return radioButton.value
}

buttonEl.addEventListener('click', async () => {
    const lang = radioValue()
    const input = inputEl.value
    if (!input) {
        errorEl.textContent = 'No text to translate provided'
        return
    }
    if (!lang) {
        errorEl.textContent = 'No languange choosed'
        return
    }
    buttonEl.textContent = 'Translating...'
    const userDiv = document.createElement('div')
    userDiv.classList.add('user')
    userDiv.textContent = input
    chatEl.appendChild(userDiv)
    appendChat(await translate(input, lang))
})
