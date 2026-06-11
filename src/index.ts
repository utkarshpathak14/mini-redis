import * as net from "net";
import { handleConnection } from "./server/connection.js";
import { db } from "./models/db.js";
import { loadAOF } from "./utils/aof.js";


const server = net.createServer((socket: net.Socket) => {
  handleConnection(socket, db);
});

loadAOF(db);

const port = 6000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

