    Create the standaloneQuestionChain which has the standaloneQuestion prompt, the llm, and the StringOutputParser. 
    
    Create the retrieverChain which takes the standalone question from the previous results and has the retriever and combineDocs.
    
    Create the answerChain that has the answer prompt, the llm and the StringOutputParser.
    
    Put the above chains together in a RunnableSequence and have each provide the input_variables needed by the next step.
    
    To pass the original question to the answer chain, you will need to use a RunnablePassthrough.
    
    The standaloneQuestionChain and answerChain can be either a RunnableSequence or a chain of .pipe() methods as you prefer.
    
    To pass the standalone question to the retriever, you will likely need to use an arrow function, and will therefore need the retrieverChain to be a RunnableSequence.