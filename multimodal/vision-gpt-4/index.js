import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const imgURL = "https://raw.githubusercontent.com/VArtzy/HostImage/refs/heads/main/5f37e0cbba673_resized.jpg";

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What do you see in the image i gave?" },
        {
          type: "image_url",
          image_url: { 
            url: imgURL
          }
        }
      ]
    }
  ]
});
console.log(response.choices[0]);

document.body.innerHTML = `<img src="${imgURL}" alt="Image to analyze">`;