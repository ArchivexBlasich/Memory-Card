import { useState, useEffect, useRef } from "react";
import data from "../data";
import type { Data } from "../data";
import { Card } from "./Card";
import { getGifUrl } from "../utils";
import "../styles/App.css";

const API_KEY = "Sv8ppGyxWpTMsC5PLH90uvD2RvUuM4fF";
let didInit = false;

interface DataList extends Data {
  gifUrl: string;
}

function App() {
  const [dataList, setDataList] = useState<DataList[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(
    new Set()
  );
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const openDialogRef = useRef<HTMLDialogElement>(null);

  function shufflePlayers(array: DataList[]) {
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
    setDataList(shufflePlayers(dataList.slice()));
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
        const gifs = await fetchGifs(data.map((d) => getGifUrl(d.id, API_KEY)));

        const playersWithImgUrl: DataList[] = [];
        for (const [i, player] of data.entries()) {
          playersWithImgUrl.push({
            ...player,
            gifUrl: gifs[i].data.images.original.url,
          });
        }

        setDataList(shufflePlayers(playersWithImgUrl));
      }

      getImagesUrlsFromGifs();

      if (openDialogRef.current) {
        openDialogRef.current.showModal();
      }
    }
  }, []);

  function handleCloseOpenModal() {
    if (openDialogRef.current) {
        openDialogRef.current.close();
      }
  }

  return (
    <div className="container">
      <dialog ref={openDialogRef}>
        <div>
          <h2>🏆 Game Instructions</h2>
          <ol>
            <li>Click on different Cards to score points.</li>
            <li>
              Don’t click the same card twice — if you do, the round ends!
            </li>
            <li>After each click, the cards shuffle into a new order.</li>
            <li>Your score increases with each unique card you pick.</li>
            <li>Try to beat your Best Score!</li>
          </ol>
          <button onClick={handleCloseOpenModal}>Play</button>
        </div>
      </dialog>
      <header>
        <h2>🇦🇷 MemorArgentina</h2>
        <div className="score">
          <p>Score: {score}</p>
          <p>Max Score:{maxScore}</p>
        </div>
      </header>
      <div className="cards">
        {dataList.map((d) => (
          <Card key={d.id} data={d} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}

export default App;
