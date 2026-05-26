import * as net from "net";
import { formatBulkString, formatError } from "../responses/formatter.js";

export const handleGet = (
  parts: string[],
  socket: net.Socket,
  db: Map<string, string>
): void => {
  const key = parts[1];

  if (!key) {
    socket.write(formatError("GET command requires a key"));
    return;
  }

  const value = db.get(key);
  socket.write(formatBulkString(value || null));
};
