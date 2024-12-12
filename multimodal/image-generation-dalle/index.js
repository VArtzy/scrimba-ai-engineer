import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

const form = document.querySelector("#posterForm");
const movieTitle = document.querySelector("#movie-title");
const artStyles = document.querySelector("#art-styles");
const posterOutput = document.querySelector("#poster-output");

/*  
  Image generation project requirements:
    - Create a prompt from the movie title and art style submitted by the user
    - Use the image generations endpoint to provide `dall-e-3`
      or `dall-e-2` the prompt created by the form submission
    - Display the final poster image within the `posterOutput` div

  Stretch goals: 
    - On submit, display text describing the image being generated 
    - Provide user feedback when any errors occur
*/

form.addEventListener("submit", function (event) {
  event.preventDefault()
  generatePoster()
  form.reset()
});

async function generatePoster() {
  try {
    posterOutput.textContent = `Your movie poster is generated...`
    const data = await openai.images.generate({
        model: 'dall-e-2',
        prompt: `Create imaginary movie poster titled "${movieTitle.value}" with ${artStyles.value} art style`,
        size: '256x256'
    })
    posterOutput.innerHTML = `<img src="${data.data[0].url}" alt="${movieTitle.value}" />`
    } catch (err) {
      posterOutput.textContent = `Sorry, there is an error. You can try again later.`
      console.error(err)
    }
}