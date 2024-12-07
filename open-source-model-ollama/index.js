import ollama from "ollama";
import express from "express";

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    const question = req.query.question;
    if (!question) {
        res.status(200).send("Ask something via the `?question=` parameter");  
    } else {
        const response = await ollama.chat({
            model: 'mistral',
            messages: [{ role: 'user', content: question }],
        });
        res.status(200).send(response.message.content);
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

