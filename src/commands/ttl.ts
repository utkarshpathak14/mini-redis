import * as net from "net";
import { formatInteger, formatError } from "../responses/formatter.js";
import type { StoredValue } from "../models/db.js";

export const handleTTL = (
  parts: string[],
  socket: net.Socket,
  db: Map<string, StoredValue>
): void => {
  const key = parts[1];
  if (!key) {
    socket.write(formatError("TTL command requires a key"));
    return;
  }
  const storedValue = db.get(key);

  if (!storedValue) {
    socket.write(formatInteger(-2));
    return;
  }
  if (!storedValue.expireAt) {
    socket.write(formatInteger(-1));
    return;
  }
  if (storedValue.expireAt < Date.now()) {
    db.delete(key);
    socket.write(formatInteger(-2));
    return;
  }

  const remainingMs = storedValue.expireAt - Date.now();
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  socket.write(formatInteger(remainingSeconds));
};