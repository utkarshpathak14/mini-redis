
import * as net from "net";
import { commandParser } from "../protocols/resp.js";
import { handleCommand } from "../commands/registry.js";

export const handleConnection = (socket: net.Socket, db: Map<string, string>): void => {
  console.log("a net client connected");
  let command = "";

  socket.on("data", (data: Buffer) => {
    command += data.toString();

    if (command.includes("\n")) {
      let parts: string[] = [];

      if (command.startsWith("*")) {
        parts = commandParser(data);
      } else {
        parts = command.trim().split(" ");
      }

      command = "";

      const cmd = parts[0]!.toUpperCase();
      console.log(cmd);
      handleCommand(cmd, parts, socket, db);
    }
  });


  
  socket.on("end", () => {
    console.log(`disconnected`);
  });

  socket.on("error", (err: Error) => {
    console.error(`Error:`, err.message);
  });
};
