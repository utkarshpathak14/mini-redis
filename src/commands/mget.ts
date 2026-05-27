import * as net from "net";
import { formatError,formatArray , formatBulkString } from "../responses/formatter.js";


// mget key1 key2 key3 
// we have to iterate and check for each key 
// create a result array and push the value for each key (or null if not found)
// 

export const handleMultiGet = (
  parts: string[],
  socket: net.Socket,
db: Map<string, string>)
: void => {
  if (parts.length < 2) {
    socket.write(formatError("MGET command requires at least one key"));
    return;
  }
  const results: (string | null)[] = [];
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


// Logic:
// - Accept multiple keys from parts[1] onwards
// - Fetch value for each key from db
// - Return array of values (use nil for missing keys)
// - Format as RESP array with bulk strings