import * as net from "net";
import { formatInteger, formatError } from "../responses/formatter.js";
import type { StoredValue } from "../models/db.js";

export const handleDel = (
  parts: string[],
  socket: net.Socket,
  db: Map<string, StoredValue>
): void => {
  const key = parts[1];

  if (!key) {
    socket.write(formatError("DEL command requires a key"));
    return;
  }

  const wasDeleted = db.delete(key);
  socket.write(formatInteger(wasDeleted ? 1 : 0));
};
