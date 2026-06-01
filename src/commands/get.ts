import * as net from "net";
import { formatBulkString, formatError } from "../responses/formatter.js";
import type { StoredValue } from "../models/db.js";

export const handleGet = (
  parts: string[],
  socket: net.Socket,
  db: Map<string, StoredValue>
): void => {
  const key = parts[1]; 
  if (!key) {
    socket.write(formatError("GET command requires a key"));
    return;
  }

  const value = db.get(key);

  if(value && value.expireAt && value.expireAt < Date.now()) {
    db.delete(key);
    socket.write(formatBulkString(null));
    return;
  }


  socket.write(formatBulkString(value || null));
};
