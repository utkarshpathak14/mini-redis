import * as net from "net";
import { formatSimpleString, formatError, formatInteger } from "../responses/formatter.js";
import type { StoredValue } from "../models/db.js";
import { appendToAOF } from "../utils/aof.js";


export const handleExpire = (
  parts: string[],
  socket: net.Socket,
  db: Map<string, StoredValue>
): void => {
    const key = parts[1];
    const seconds = parseInt(parts[2]!, 10);
    if(!key || isNaN(seconds)) {
        socket.write(formatError("EXPIRE command requires a key and a valid number of seconds"));
        return;
    }
    const storedValue = db.get(key);
    if(!storedValue) {
        socket.write(formatInteger(0));
        return;
    }
    const expireAt = Date.now() + (seconds * 1000);
    db.set(key,{ ...storedValue, expireAt });
    socket.write(formatInteger(1));
    appendToAOF("EXPIRE", key, seconds.toString());
    
    return;
};