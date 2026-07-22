import type { Metadata } from "next";
import "./lecture.css";
import { slides, parts, deckMeta } from "@/data/lecture";
import LectureDeck from "./LectureDeck";

export const metadata: Metadata = {
  title: deckMeta.title,
  description: `${deckMeta.author} — ${deckMeta.subtitle}`,
};

export default function LectureDeckPage() {
  return <LectureDeck slides={slides} parts={parts} />;
}
