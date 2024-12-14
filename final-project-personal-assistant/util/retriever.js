import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY
const embeddings = new OpenAIEmbeddings({ openAIApiKey })
const sbApiKey = import.meta.env.VITE_SUPABASE_API_KEY
const sbUrl = import.meta.env.VITE_SUPABASE_URL
const client = createClient(sbUrl, sbApiKey)

const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'informations',
    queryName: 'match_informations'
})

const retriever = vectorStore.asRetriever(2)

export { retriever }
