import { openDB } from "idb";
import type { History } from "../types/history";

export const dbPromise = openDB("nennen-db", 1, {
  upgrade(db) {
    db.createObjectStore("history", {
      keyPath: "id",
    });
  },
})

export async function saveHistory(history: History) {
  const db = await dbPromise;
  await db.put("history", history);
}

export async function getHistory() {
  const db = await dbPromise;
  return await db.getAll("history");
}