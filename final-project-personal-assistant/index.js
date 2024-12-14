import 'poplog'
import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables'
import { retriever } from './util/retriever'
import storeVector from './util/store'

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY
const llm = new ChatOpenAI({ openAIApiKey })
const standaloneQuestion = `Given some chat history (if any) and a question, convert the question to a standalone question. chat history: {chat_history} question: {question} standalone question:`
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestion)

const answer = `You are a helpful and enthusiastic personal assistant who can answer a given question based on the context provided and the chat history. Try to find answer in the context. If the answer is not given, find the answer in chat history if possible. If you really don't know the answer, say "I'm sorry, I don't lnow the asnwer to that". Always speak as if you were professional assistant and chatty like to a friend. context: {context} chat history {chat_history} question: {question} answer:`
const answerPrompt = PromptTemplate.fromTemplate(answer)

const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser())

const retrieverChain = RunnableSequence.from([
    prev => prev.standalone_question,
    retriever,
    informations => informations.map(i => i.pageContent).join('\n')
])

const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser())

const chain = RunnableSequence.from([
    {
        standalone_question: standaloneQuestionChain,
        original: new RunnablePassthrough()
    },
    {
        context: retrieverChain,
        question: ({ original }) => original.question,
        chat_history: ({ original }) => original.chat_history
    },
    answerChain
])

const chatHistory = []

const submit = document.getElementById('submit')
submit.addEventListener('click', async () => {
    const query = document.getElementById('query')
    const conversation = document.querySelector('main')
    const question = query.value
    query.value = ''

    const userDiv = document.createElement('div')
    userDiv.classList.add('user')
    conversation.appendChild(userDiv)
    userDiv.textContent = question
    conversation.scrollTop = conversation.scrollHeight

    const response = await chain.invoke({
        question,
        chat_history: formatChatHistory(chatHistory)
    })
    chatHistory.push(question)
    chatHistory.push(response)

    const botDiv = document.createElement('div')
    botDiv.classList.add('bot')
    conversation.appendChild(botDiv)
    botDiv.textContent = response
    conversation.scrollTop = conversation.scrollHeight
})

const capture = document.getElementById('capture')
capture.addEventListener('click', () => {
    const information = document.getElementById('query')
    storeVector(information.value)
    information.value = ''
})

function formatChatHistory(messages) {
    return messages.map((message, i) => {
        if (i % 2 === 0) return `User: ${message}`
        else return `Bot: ${message}`
    }).join('\n')
}
