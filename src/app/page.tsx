'use client';
import styles from "./page.module.css";

import { create } from 'zustand';
import Link from "next/link";

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
  rotatePlayers: (side, forward=true) => set((state) => {
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
    <Link href={'/game'}>
      <h1>Go to game</h1>
    </Link>
  );
}
