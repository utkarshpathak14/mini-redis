
import * as net from "net";
import { formatSimpleString } from "../responses/formatter.js";

export const handleAuth = (socket: net.Socket): void => {
  socket.write(formatSimpleString("OK"));
};
