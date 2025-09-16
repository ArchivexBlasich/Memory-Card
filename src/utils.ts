function getGifUrl(id: string, API_KEY: string) {
  return `https://api.giphy.com/v1/gifs/${id}?api_key=${API_KEY}`;
}

function getImageUrl() {}


export { getGifUrl, getImageUrl };
