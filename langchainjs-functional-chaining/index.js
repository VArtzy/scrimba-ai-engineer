import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { retriever } from '/utils/retriever'
import { combineDocuments } from '/utils/combineDocuments'
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable"

document.addEventListener('submit', (e) => {
    e.preventDefault()
    progressConversation()
}) 

const openAIApiKey = process.env.OPENAI_API_KEY
const llm = new ChatOpenAI({ openAIApiKey })

const standaloneQuestionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:'
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about Scrimba based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
question: {question}
answer: `
const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

/**
 * Super Challenge:
 * 
 * Set up a RunnableSequence so that the standaloneQuestionPrompt 
 * passes the standalone question to the retriever, and the retriever
 * passes the combined docs as context to the answerPrompt. Remember, 
 * the answerPrompt should also have access to the original question. 
 * 
 * When you have finished the challenge, you should see a 
 * conversational answer to our question in the console.
 * 
**/

const questionChain = RunnableSequence.from([ standaloneQuestionPrompt, llm, new StringOutputParser(), retriever, combineDocuments ])

const answerChain = RunnableSequence.from([ answerPrompt, llm, new StringOutputParser() ])

const chain = RunnableSequence.from([
    {context: questionChain, question: original => original.question},
    answerChain
])

const response = await chain.invoke({
    question: 'What are the technical requirements for running Scrimba? I only have a very old laptop which is not that powerful.'
})

console.log(response)

async function progressConversation() {
    const userInput = document.getElementById('user-input')
    const chatbotConversation = document.getElementById('chatbot-conversation-container')
    const question = userInput.value
    userInput.value = ''

    // add human message
    const newHumanSpeechBubble = document.createElement('div')
    newHumanSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newHumanSpeechBubble)
    newHumanSpeechBubble.textContent = question
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight

    // add AI message
    const newAiSpeechBubble = document.createElement('div')
    newAiSpeechBubble.classList.add('speech', 'speech-ai')
    chatbotConversation.appendChild(newAiSpeechBubble)
    newAiSpeechBubble.textContent = result
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
}