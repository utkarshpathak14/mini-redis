import * as net from "net";
import { formatSimpleString, formatError } from "../responses/formatter.js";
import type { StoredValue } from "../models/db.js";
import { appendToAOF } from "../utils/aof.js";


export const handleMultiSet = (
  parts: string[],
  socket: net.Socket,
  db: Map<string, StoredValue>
): void => {
    if (parts.length < 3 || parts.length % 2 === 0) {
        socket.write(formatError("MSET command requires an odd number of arguments (command + pairs)"));
        return;
    }
    for(let i=1; i < parts.length; i+=2) {
        const key = parts[i];
        const value = parts[i+1];
        if(!key || !value) {
            socket.write(formatError("ERR syntax error or missing values"));
            return;
        }
        db.set(key, { value });
    }
    socket.write(formatSimpleString("OK"));
    appendToAOF("MSET", ...parts.slice(1));
};


