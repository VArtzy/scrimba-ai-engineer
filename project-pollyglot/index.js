import OpenAI from "https://cdn.jsdelivr.net/npm/openai@latest/+esm"

const inputEl = document.getElementById('input')
const langEl = document.getElementsByName('lang')
const buttonEl = document.getElementById('translate')
const errorEl = document.getElementById('error')
const contentEl = document.getElementById('content')
const contentCopy = contentEl.cloneNode(true) 

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

function renderTranslate(translate) {
    if (translate) {
        contentEl.innerHTML = translate
        errorEl.textContent = ''
    }
    buttonEl.textContent = 'Start Over'
}

function radioValue() {
    for (const radioButton of langEl) if (radioButton.checked) return radioButton.value
}

buttonEl.addEventListener('click', async () => {
    if (buttonEl.textContent === 'Start Over') {
        contentEl.innerHTML = contentCopy.innerHTML
        buttonEl.textContent = 'Translate'
        errorEl.textContent = ''
        return
    }
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
    renderTranslate(await translate(input, lang))
})
