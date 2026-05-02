import * as net from "net";

//new hashmap
const db = new Map<string, any>();

function parser(command:string):string[]{
  const parts = command.split("\r\n");
  const result:string[] = [];
  for(let i=2 ; i<parts.length; i+=2){
    result.push(parts[i]!) 
  }
  return result;
}

// const commandParser = (data: Buffer) => {
//   return data
//     .toString()
//     .split("\r\n")
//     .filter((c) => !c.startsWith("*") && !c.startsWith("$") && c !== "");
// };



const server = net.createServer((socket: net.Socket) => {
  console.log("a net client connected");
  let command = "";

  socket.on("data", (data: Buffer) => {
    command += data.toString();

    if (command.includes("\n")) {
      let parts: string[] = [];

      if(command.startsWith("*")){
        parts = parser(command);
      }else{
         parts = command.trim().split(" ");
      }

      command = "";
 
      const cmd = parts[0]!.toUpperCase();
      console.log(cmd)

      if (cmd === "PING") {
        socket.write(`+PONG\r\n`);
      } 
      else if (cmd === "AUTH") {
        socket.write(`+OK\r\n`); 
      }
      else if (cmd === "HELLO" || cmd === "INFO" || cmd === "COMMAND" || cmd === "DOCS") {
        socket.write(`-ERR unknown command '${cmd}'\r\n`);
      }

      if (cmd === "SET") {
        const key = parts[1];
        const value = parts.slice(2).join(" ");
        if(key && value){
             db.set(key, value);
            socket.write(`+OK\r\n`);
        }else{
             socket.write(`-ERR SET command requires a key and a value\r\n`);
        }
       
      } else if (cmd === "GET") {
        const key = parts[1];
        if(key){
            const value = db.get(key);
            socket.write(`$${value!.length}\r\n${value}\r\n`);
        } else {
                socket.write(`-ERR GET command requires a key\r\n`);
            }

      } else if (cmd === "DEL") {
        const key = parts[1];
        if(key){
             const wasDeleted = db.delete(key);
             socket.write(`:${wasDeleted ? 1 : 0}\r\n`);
        } else {
             socket.write(`-ERR DEL command requires a key\r\n`);
        }
       
      } else{
        socket.write(`-ERR unknown command '${cmd}'\r\n`);
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

const port = 6000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});




// // const testCommand = "*3\r\n$3\r\nSET\r\n$4\r\nname\r\n$7\r\nutkarsh\r\n";
// // console.log(parser(testCommand));

