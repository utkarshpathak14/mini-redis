import * as net from "net";

// The Database
const db = new Map<string, string>();

// Your RESP Parser (Slightly adjusted to handle the exact \r\n split)
function parseRESP(command: string): string[] {
  const parts = command.split("\r\n"); 
  const result: string[] = [];
  // Loop through the actual values
  for(let i=2; i < parts.length; i+=2) {
    if (parts[i]) result.push(parts[i]!); 
  }
  return result;
}

const server = net.createServer((socket: net.Socket) => {
  console.log("🟢 A net client connected");
  let command = "";

  socket.on("data", (data: Buffer) => {
    command += data.toString();

    // Check if a full command has arrived
    if (command.includes("\n")) {
      
      let parts: string[] = [];

      // 🧠 THE DUAL-MODE ROUTER
      if (command.startsWith("*")) {
          // It's official RESP (Do NOT trim, keep the \r\n intact)
          parts = parseRESP(command);
      } else {
          // It's plain text from Telnet or your custom CLI
          parts = command.trim().split(" ");
      }

      // Clear the buffer for the next incoming data
      command = "";
      
      const cmd = parts[0]?.toUpperCase();

      if (cmd === "SET") {
        const key = parts[1];
        const value = parts.slice(2).join(" ");
        if (key && value) {
            db.set(key, value);
            // Must reply in RESP Simple String format
            socket.write(`+OK\r\n`); 
        } else {
            // Must reply in RESP Error format
            socket.write(`-ERR SET command requires a key and a value\r\n`);
        }
       
      } else if (cmd === "GET") {
        const key = parts[1];
        if (key) {
            const value = db.get(key);
            if (value !== undefined) {
                // Must reply in RESP Bulk String format (includes length of string)
                socket.write(`$${value.length}\r\n${value}\r\n`);
            } else {
                // Must reply in RESP Null format for missing keys
                socket.write(`$-1\r\n`); 
            }
        } else {
            socket.write(`-ERR GET command requires a key\r\n`);
        }

      } else if (cmd === "DEL") {
        const key = parts[1];
        if (key) {
             const wasDeleted = db.delete(key);
             // Must reply in RESP Integer format (:1 or :0)
             socket.write(`:${wasDeleted ? 1 : 0}\r\n`);
        } else {
            socket.write(`-ERR DEL command requires a key\r\n`);
        }
      } else {
          socket.write(`-ERR unknown command '${cmd}'\r\n`);
      }
    }
  });

  socket.on("end", () => console.log(`🔴 disconnected`));
  socket.on("error", (err: Error) => console.error(`Error:`, err.message));
});

const port = 6379;
server.listen(port, () => console.log(`🚀 Server is listening on port ${port}`));