import * as net from "net";
import { formatSimpleString } from "../responses/formatter.js";

export const handlePing = (socket: net.Socket): void => {
  socket.write(formatSimpleString("PONG"));
};
