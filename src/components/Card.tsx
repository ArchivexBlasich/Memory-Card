import type { Data } from "../data.ts";
import "../styles/Card.css"

interface DataWithGift extends Data {
  gifUrl: string;
}

type cardProps = { data: DataWithGift; onClick: (id: string) => void };

function Card({ data, onClick }: cardProps) {
  return (
    <button className="card" onClick={() => onClick(data.id)}>
      <img src={data.gifUrl} alt={data.name} />
    </button>
  );
}

export { Card };
