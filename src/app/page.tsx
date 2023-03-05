'use client';
import styles from "./page.module.css";

import { create } from 'zustand'

type Player = 'S' | 'OH1' | 'MB1' | 'OP' | 'OH2' | 'MB2';

type GameStore = {
  homePlayers: Player[],
  awayPlayers: Player[],
  homeScore: number,
  awayScore: number,
  servingSide: 'home' | 'away',
  rotatePlayers: (side: 'home' | 'away', forward?: boolean) => void,
  updateScore: (action: 'add' | 'sub', side: 'home' | 'away') => void,
}


const useStore = create<GameStore>((set) => ({
  homePlayers: ['S', 'OH1', 'MB1', 'OP', 'OH2', 'MB2'],
  awayPlayers: ['S', 'OH1', 'MB1', 'OP', 'OH2', 'MB2'],
  homeScore: 0,
  awayScore: 0,
  servingSide: 'home',
  rotatePlayers: (side='home', forward=true) => set((state) => {
    const playerKeyname: 'homePlayers' | 'awayPlayers' = `${side}Players`;
    let players = [...state[playerKeyname]];
    if (forward) {
      players.push(players.shift() as Player);
    } else {
      players.unshift(players.pop() as Player);
    }
    return {
      [playerKeyname]: players,
    }
  }),
  updateScore: (action='add', side='home') => set((state) => {
    const scoreKeyname: 'homeScore' | 'awayScore' = `${side}Score`;
    const oldScore = state[scoreKeyname];
    const newScore = action === 'add' ? oldScore + 1 : oldScore - 1;
    const correctedScore = newScore < 0 ? 0 : newScore;

    const changeServer = action === 'add' && side !== state.servingSide;
    const nextServingSide = changeServer ? {servingSide: side} : {};

    if (changeServer) state.rotatePlayers(side);

    return {
      ...nextServingSide,
      [scoreKeyname]: correctedScore,
    }
  }),
}));



export default function Home() {

  const {homeScore, awayScore, updateScore, homePlayers, awayPlayers} = useStore();


  return (
    <main className={styles.court}>
      <div className={styles.scoreboard}>
        <button className={styles.scoreboard__button} onClick={() => updateScore('sub', 'home')}>-</button>
        <p className={styles.scoreboard__score}>{homeScore}</p>
        <button className={styles.scoreboard__button} onClick={() => updateScore('add', 'home')}>+</button>
      </div>
      <div
        className={[
          styles.home__backcourt,
          styles.court_area,
          styles.backcourt,
        ].join(" ")}
        >
        <div
          className={[
            styles.player,
            styles.player__home,
            styles.position__left,
          ].join(" ")}
        >
          {homePlayers[0]}
        </div>
        <div
          className={[
            styles.player,
            styles.player__home,
            styles.position__middle,
          ].join(" ")}
        >
          {homePlayers[5]}
        </div>
        <div
          className={[
            styles.player,
            styles.player__home,
            styles.position__right,
          ].join(" ")}
        >
          {homePlayers[4]}
        </div>
      </div>
      <div
        className={[
          styles.home__frontcourt,
          styles.court_area,
          styles.frontcourt,
        ].join(" ")}
      >
        <div
          className={[
            styles.player,
            styles.player__home,
            styles.position__left,
          ].join(" ")}
        >
          {homePlayers[1]}
        </div>
        <div
          className={[
            styles.player,
            styles.player__home,
            styles.position__middle,
          ].join(" ")}
        >
          {homePlayers[2]}
        </div>
        <div
          className={[
            styles.player,
            styles.player__home,
            styles.position__right,
          ].join(" ")}
        >
          {homePlayers[3]}
        </div>
      </div>
      <div
        className={[
          styles.away__frontcourt,
          styles.court_area,
          styles.frontcourt,
        ].join(" ")}
      >
        <div
          className={[
            styles.player,
            styles.player__away,
            styles.position__left,
          ].join(" ")}
        >
          {awayPlayers[3]}
        </div>
        <div
          className={[
            styles.player,
            styles.player__away,
            styles.position__middle,
          ].join(" ")}
        >
          {awayPlayers[2]}
        </div>
        <div
          className={[
            styles.player,
            styles.player__away,
            styles.position__right,
          ].join(" ")}
        >
          {awayPlayers[1]}
        </div>
      </div>
      <div
        className={[
          styles.away__backcourt,
          styles.court_area,
          styles.backcourt,
        ].join(" ")}
      >
        <div
          className={[
            styles.player,
            styles.player__away,
            styles.position__left,
          ].join(" ")}
        >
          {awayPlayers[4]}
        </div>
        <div
          className={[
            styles.player,
            styles.player__away,
            styles.position__middle,
          ].join(" ")}
        >
          {awayPlayers[5]}
        </div>
        <div
          className={[
            styles.player,
            styles.player__away,
            styles.position__right,
          ].join(" ")}
        >
          {awayPlayers[0]}
        </div>

      </div>
      <div className={styles.scoreboard}>
        <button className={styles.scoreboard__button} onClick={() => updateScore('sub', 'away')}>-</button>
        <p className={styles.scoreboard__score}>{awayScore}</p>
        <button className={styles.scoreboard__button} onClick={() => updateScore('add', 'away')}>+</button>
      </div>
    </main>
  );
}
