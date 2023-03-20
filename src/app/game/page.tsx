"use client";
import styles from "./game.module.css";

import { create } from "zustand";

type Player = "S" | "OH1" | "MB1" | "OP" | "OH2" | "MB2";

type Side = 'home' | 'away';

type SideData = {
  [key in Side]: {
    players: Player[];
    score: number;
  }
}

type GameStore = SideData & {
  servingSide: Side;
  rotatePlayers: (side: Side, forward?: boolean) => void;
  updateScore: (action: "add" | "sub", side: Side) => void;
};

const _rotatePlayers = (players: Player[], forward=true) => {
  const teamPlayers = [...players];
  if (forward) {
    teamPlayers.push(teamPlayers.shift() as Player);
  } else {
    teamPlayers.unshift(teamPlayers.pop() as Player);
  }
  return teamPlayers;
}

const useStore = create<GameStore>((set) => ({
  home: {
    players: ["S", "OH1", "MB1", "OP", "OH2", "MB2"],
    score: 0,
  },
  away: {
    players: ["S", "OH1", "MB1", "OP", "OH2", "MB2"],
    score: 0,
  },
  servingSide: "home",
  rotatePlayers: (side, forward = true) =>
    set(({ [side]: teamData}) => {
      // const playerKeyname: "homePlayers" | "awayPlayers" = `${side}Players`;
      const teamPlayers = _rotatePlayers(teamData.players, forward);
      return {
        [side]: {
          ...teamData,
          players: teamPlayers,
        },
      };
    }),
  updateScore: (action = "add", side) =>
    set(({ [side]: teamData, servingSide }) => {
      // const scoreKeyname: "homeScore" | "awayScore" = `${side}Score`;
      const oldScore = teamData.score;
      const newScore = action === "add" ? oldScore + 1 : oldScore - 1;
      const correctedScore = newScore < 0 ? 0 : newScore;

      const changeServer = action === "add" && side !== servingSide;
      const nextServingSide = changeServer ? { servingSide: side } : {};

      const players = changeServer ? _rotatePlayers(teamData.players) : teamData.players;

      return {
        ...nextServingSide,
        [side]: {
          ...teamData,
          players,
          score: correctedScore,
        },
      };
    }),
}));

type ScoreboardProps = {
  side: "home" | "away";
};

function Scoreboard({ side }: ScoreboardProps) {
  const { [side]: teamData, updateScore } = useStore();
  const { score } = teamData;

  return (
    <div
      className={[
        styles.scoreboard__container,
        styles[`scoreboard__${side}`],
      ].join(" ")}
    >
      <h2 className={styles.scoreboard__team_name}>{side}</h2>
      <div className={styles.scoreboard}>
        <button
          className={styles.scoreboard__button}
          onClick={() => updateScore("sub", side)}
        >
          -
        </button>
        <p className={styles.scoreboard__score}>{score}</p>
        <button
          className={styles.scoreboard__button}
          onClick={() => updateScore("add", side)}
        >
          +
        </button>
      </div>
    </div>
  );
}

function Court() {
  const { home, away } = useStore();
  const { players: homePlayers } = home;
  const { players: awayPlayers } = away;

  return (
    <>
      <div
        className={[
          styles.court_area,
          styles.backcourt,
          styles.home__backcourt,
        ].join(" ")}
      >
        <div className={[styles.player, styles.player__home].join(" ")}>
          {homePlayers[0]}
        </div>
        <div className={[styles.player, styles.player__home].join(" ")}>
          {homePlayers[5]}
        </div>
        <div className={[styles.player, styles.player__home].join(" ")}>
          {homePlayers[4]}
        </div>
      </div>
      <div
        className={[
          styles.court_area,
          styles.frontcourt,
          styles.home__frontcourt,
        ].join(" ")}
      >
        <div className={[styles.player, styles.player__home].join(" ")}>
          {homePlayers[1]}
        </div>
        <div className={[styles.player, styles.player__home].join(" ")}>
          {homePlayers[2]}
        </div>
        <div className={[styles.player, styles.player__home].join(" ")}>
          {homePlayers[3]}
        </div>
      </div>
      <div
        className={[
          styles.court_area,
          styles.frontcourt,
          styles.away__frontcourt,
        ].join(" ")}
      >
        <div className={[styles.player, styles.player__away].join(" ")}>
          {awayPlayers[3]}
        </div>
        <div className={[styles.player, styles.player__away].join(" ")}>
          {awayPlayers[2]}
        </div>
        <div className={[styles.player, styles.player__away].join(" ")}>
          {awayPlayers[1]}
        </div>
      </div>
      <div
        className={[
          styles.court_area,
          styles.backcourt,
          styles.away__backcourt,
        ].join(" ")}
      >
        <div className={[styles.player, styles.player__away].join(" ")}>
          {awayPlayers[4]}
        </div>
        <div className={[styles.player, styles.player__away].join(" ")}>
          {awayPlayers[5]}
        </div>
        <div className={[styles.player, styles.player__away].join(" ")}>
          {awayPlayers[0]}
        </div>
      </div>
    </>
  )
}

export default function Game() {
  return (
    <main className={styles.court}>
      <Scoreboard side="home" />
      <Court />
      <Scoreboard side="away" />
    </main>
  );
}
