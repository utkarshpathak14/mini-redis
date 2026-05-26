import * as net from "net";
import { handleConnection } from "./server/connection.js";
import { db } from "./models/db.js";

const server = net.createServer((socket: net.Socket) => {
  handleConnection(socket, db);
});

const port = 6000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

