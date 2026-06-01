import * as net from "net";
import { formatError,formatArray , formatBulkString } from "../responses/formatter.js";
import type { StoredValue } from "../models/db.js";


export const handleMultiGet = (
  parts: string[],
  socket: net.Socket,
db: Map<string, StoredValue>)
: void => {
  if (parts.length < 2) {
    socket.write(formatError("MGET command requires at least one key"));
    return;
  }
  const results: (StoredValue | null)[] = [];
  for(let i=1; i < parts.length; i++) {
    const key = parts[i];
    if(!key) {
        socket.write(formatError("ERR syntax error or missing keys"));
        return;
    }
    const value = db.get(key);
    results.push(value !== undefined ? value : null);
    
  }
  socket.write(formatArray(results));
}