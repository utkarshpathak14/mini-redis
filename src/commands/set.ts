import * as net from "net";
import { formatSimpleString, formatError } from "../responses/formatter.js";
import type { StoredValue } from "../models/db.js";

export const handleSet = (
  parts: string[],
  socket: net.Socket,
  db: Map<string, StoredValue>
): void => {
  const key = parts[1];
  const value = parts.slice(2).join(" ");

  if (!key || !value) {
    socket.write(formatError("SET command requires a key and a value"));
    return;
  }

  db.set(key, { value });
  socket.write(formatSimpleString("OK"));
};
