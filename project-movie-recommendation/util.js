import { openai, supabase } from './config.js'
import content from './content.js'

export async function store() {
    const data = await Promise.all(content.map(async movie => {
        const embeddingRes = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: movie.content
        })

        return {
            content: movie.content,
            title: movie.title,
            year: movie.releaseYear,
            embedding: embeddingRes.data[0].embedding
        }
    }))

    await supabase.from('movies').insert(data)
    console.log('Store embedding to database complete!')
}

export async function createEmbedding(input) {
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input
    })
    return embedding.data[0].embedding
}

export async function findNearestMatch(embedding) {
    const { data } = await supabase.rpc('match_movies', {
        query_embedding: embedding,
        match_threshold: 0.50,
        match_count: 1
    })
    return data[0]
}

export async function getChatCompletion(context, query) {
    const chatMessages = [
        {
            role: 'system',
            content: `You are an enthusiastic movie expert who loves recommending movie to people. You will be given information context about the movie and query from user. Your main job is to formulate a short answer reason why this movie is recommend using the provided context and query. If you are unsure and cannot find the reason in the context, say, "Sorry, there is no match movie i can recommend." Please do not make up the answer.`
        },
        {
            role: 'user',
            content: `Context: ${context} Query: ${query}`
        }
    ]

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: chatMessages,
        temperature: 0.5,
        frequency_penalty: 0.5
    })

    return response.choices[0].message.content
}
