import { useState, useEffect } from "react";
import players from "./players";
import type { Player } from "./players";
import { getGifUrl } from "./utils";
import "./App.css";

const API_KEY = "Sv8ppGyxWpTMsC5PLH90uvD2RvUuM4fF";
let didInit = false;

interface PlayerList extends Player {
  imageUrl: string;
}

function App() {
  const [playerList, setPlayerList] = useState<PlayerList[]>([]);

  useEffect(() => {
    if (!didInit) {
      didInit = true;

      async function fetchGifs(gifUrls: string[]) {
        const gifUrlsResponse = await Promise.all(
          gifUrls.map(async (url) => fetch(url))
        );

        const gifs = await Promise.all(
          gifUrlsResponse.map((gif) => gif.json())
        );

        return gifs;
      }

      async function getImagesUrlsFromGifs() {
        const gifs = await fetchGifs(
          players.map((player) => getGifUrl(player.id, API_KEY))
        );

        const playersWithImgUrl: PlayerList[] = [];
        for (const [i, player] of players.entries()) {
          playersWithImgUrl.push({
            ...player,
            imageUrl: gifs[i].data.images.original.url,
          });
        }

        setPlayerList(playersWithImgUrl);
      }

      getImagesUrlsFromGifs();
    }
  }, []);

  return (
    <>
      {playerList.map(player => 
          <img src={player.imageUrl} alt={player.name}></img>
      )}
    </>
  );
}

export default App;
