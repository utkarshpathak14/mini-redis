import * as net from "net";
import { formatInteger, formatError, formatSimpleString } from "../responses/formatter.js";
import type { StoredValue } from "../models/db.js";
import { appendToAOF } from "../utils/aof.js";


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
  appendToAOF("DEL", key);

};


export const flushdb = (socket: net.Socket, db: Map<string, StoredValue>): void => {
  if(db.size > 0) {
    db.clear();
  }
  socket.write(formatSimpleString("OK"));
  appendToAOF("FLUSHDB");

};
