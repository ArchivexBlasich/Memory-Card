import { useState, useEffect } from "react";
import players from "./players";
import type { Player } from "./players";
import { Card } from "./components/Card";
import { getGifUrl } from "./utils";
import "./App.css";

const API_KEY = "Sv8ppGyxWpTMsC5PLH90uvD2RvUuM4fF";
let didInit = false;

interface PlayerList extends Player {
  gifUrl: string;
}

function App() {
  const [playerList, setPlayerList] = useState<PlayerList[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);

  function shufflePlayers(array: PlayerList[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function handleCardClick(id: string) {
    if (selectedPlayers.has(id)) {
      if (score > maxScore) setMaxScore(score);
      setScore(0);
      setSelectedPlayers(new Set());
      return;
    }

    setScore(score + 1);
    setSelectedPlayers(new Set(selectedPlayers.add(id)));
    setPlayerList(shufflePlayers(playerList.slice()))
  }

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
            gifUrl: gifs[i].data.images.original.url,
          });
        }

        setPlayerList(shufflePlayers(playersWithImgUrl));
      }

      getImagesUrlsFromGifs();
    }
  }, []);

  return (
    <>
      <header>
        <p>{score}</p>
        <p>{maxScore}</p>
      </header>
      {playerList.map((player) => (
        <Card key={player.id} player={player} onClick={handleCardClick} />
      ))}
    </>
  );
}

export default App;
