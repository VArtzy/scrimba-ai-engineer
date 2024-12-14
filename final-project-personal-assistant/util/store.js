import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { OpenAIEmbeddings } from "@langchain/openai"
import { createClient } from '@supabase/supabase-js'

export default async function storeVector(message) {
    try {
        // const result = await fetch('../personal-info.txt')
        // const text = await result.text()
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 200,
            chunkOverlap: 10
        })
        const output = await splitter.createDocuments([message])

        const sbApiKey = import.meta.env.VITE_SUPABASE_API_KEY
        const sbUrl = import.meta.env.VITE_SUPABASE_URL
        const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY

        const client = createClient(sbUrl, sbApiKey)

        await SupabaseVectorStore.fromDocuments(output, new OpenAIEmbeddings({ openAIApiKey }), {
            client,
            tableName: 'informations'
        })
        console.log('success storing vectors!')
    } catch (e) {
        console.log(e)
    }
}
