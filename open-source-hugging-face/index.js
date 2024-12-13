import { HfInference } from '@huggingface/inference'

// Create your Hugging Face Token: https://huggingface.co/settings/tokens
// Set your Hugging Face Token: https://scrimba.com/dashboard#env
// Learn more: https://scrimba.com/links/env-variables
const hf = new HfInference(import.meta.env.VITE_HF_TOKEN)

// HuggingFace.js Inference docs
// https://huggingface.co/docs/huggingface.js/inference/README

const model = "ghoskno/Color-Canny-Controlnet-model"

const oldImageUrl = "/old-photo.jpeg"
const oldImageResponse = await fetch(oldImageUrl)
const oldImageBlob = await oldImageResponse.blob()

const prompt = `An elderly couple walks together on a gravel path with green 
grass and trees on each side. Wearing neutral-colored clothes, they face away
 from the camera as they carry their bags.`

const newImageBlob = await hf.imageToImage({
  model: model,
  inputs: oldImageBlob,
  parameters: {
    prompt: prompt,
    negative_prompt: "Black and white photo. text, bad anatomy, blurry, low quality",
    // Between 0 and 1
    strength: 0,
  }
})

const newImageBase64 = await blobToBase64(newImageBlob)
const newImage = document.getElementById("new-image")
newImage.src = newImageBase64
