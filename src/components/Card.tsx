import type { Player } from "../players.ts";

interface PlayerWithGift extends Player {
  gifUrl: string;
}

type cardProps = { player: PlayerWithGift; onClick: (id: string) => void };

function Card({ player, onClick }: cardProps) {
  return (
    <button onClick={() => onClick(player.id)}>
      <img src={player.gifUrl} alt={player.name} />
    </button>
  );
}

export { Card };
