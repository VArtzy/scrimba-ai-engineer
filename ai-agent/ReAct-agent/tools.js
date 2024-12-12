export async function getCurrentWeather() {
    const weather = {
        temperature: "32",
        unit: "C",
        forecast: "cloudy"
    }
    return JSON.stringify(weather)
}

export async function getLocation() {
    return "Surakarta, Jawa Tengah, Indonesia"
}
