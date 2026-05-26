import * as net from "net";
import { handlePing } from "./ping.js";
import { handleAuth } from "./auth.js";
import { handleSet } from "./set.js";
import { handleGet } from "./get.js";
import { handleDel } from "./del.js";
import { formatError } from "../responses/formatter.js";

export const handleCommand = (
  cmd: string,
  parts: string[],
  socket: net.Socket,
  db: Map<string, string>
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
