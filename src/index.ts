import * as net from "net";

//new hashmap
const db = new Map<string, string>();

const server = net.createServer((socket: net.Socket) => {
  console.log("a net client connected");
  let command = "";

  //listen for data from this specific client
  socket.on("data", (data: Buffer) => {
    command += data.toString();
    // console.log(`client id connected: ${id}`)

    if (command.includes("\n")) {
      const finalCommand = command.trim();
      console.log(`Final command received: ${finalCommand}`);
      command = "";
    //   socket.write(`Command recieved: ${finalCommand}\n`);

      const parts = finalCommand.split(" ");
      const cmd = parts[0]?.toUpperCase();

      if (cmd === "SET") {
        const key = parts[1];
        const value = parts.slice(2).join(" ");
        if(key && value){
             db.set(key, value);
            socket.write(`OK\n`);
        }else{
            socket.write(`Error: SET command requires a key and a value\n`);
        }
       
      } else if (cmd === "GET") {
        const key = parts[1];
        if(key){
            const value = db.get(key);
            socket.write(`${value}\n`);
        } else {
                socket.write(`Error: GET command requires a key\n`);
            }

      } else if (cmd === "DEL") {
        const key = parts[1];
        if(key){
             db.delete(key);
             socket.write(`OK\n`);
        } else {
            socket.write(`Error: DEL command requires a key\n`);
        }
       
      }
    }
  });
  socket.on("end", () => {
    console.log(`disconnected`);
  });
  socket.on("error", (err: Error) => {
    console.error(`Error:`, err.message);
  });
});

const port = 6379;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
