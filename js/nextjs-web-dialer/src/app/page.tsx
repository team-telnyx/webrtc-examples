"use client"; // This is a client component 👈🏽

import styles from "./page.module.css";
import { WebDialer } from "@/components/WebDialer";

export default function Home() {
  return (
    <main className={styles.main}>
      <WebDialer />
    </main>
  );
}
