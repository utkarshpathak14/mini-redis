import * as net from "net";
import { handlePing } from "./ping.js";
import { handleAuth } from "./auth.js";
import { handleSet } from "./set.js";
import { handleGet } from "./get.js";
import { flushdb, handleDel } from "./del.js";
import { formatError } from "../responses/formatter.js";
import { handleMultiGet } from "./mget.js";
import { handleMultiSet } from "./mset.js";
import type { StoredValue } from "../models/db.js";
import { handleExpire } from "./exp.js";
import { handleTTL } from "./ttl.js";

export const handleCommand = (
  cmd: string,
  parts: string[],
  socket: net.Socket,
  db: Map<string, StoredValue>
): void => {
  switch (cmd) {
    case "PING":
      handlePing(socket);
      break;
    case "AUTH":
      handleAuth(socket);
      break;
    case "SET":
      handleSet(parts, socket, db);
      break;
    case "GET":
      handleGet(parts, socket, db);
      break;
    case "DEL":
      handleDel(parts, socket, db);
      break;
    case "MGET":
      handleMultiGet(parts, socket, db);
      break;
    case "MSET":
      handleMultiSet(parts, socket, db);
      break;
    case "EXPIRE":
      handleExpire(parts, socket, db);
      break;
    case "TTL":
     handleTTL(parts, socket, db);
     break;
    case "FLUSHDB":
      flushdb(socket, db);
      break;
    case "HELLO":
    case "INFO":
    case "COMMAND":
    case "DOCS":
      socket.write(formatError(`unknown command '${cmd}'`));
      break;
    default:
      socket.write(formatError(`unknown command '${cmd}'`));
  }
};
