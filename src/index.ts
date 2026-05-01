import * as net from "net";

//new hashmap
const db = new Map<string, string>();

function parser(command:string):string[]{
  const parts = command.split("\r\n"); // [*3, $3, SET, $4, name, $7, utkarsh]
  const result:string[] = [];
  for(let i=2 ; i<parts.length; i+=2){
    result.push(parts[i]!) // ['SET', 'name', 'utkarsh']
  }
  return result;
}


const server = net.createServer((socket: net.Socket) => {
  console.log("a net client connected");
  let command = "";

  //listen for data from this specific client
  socket.on("data", (data: Buffer) => {
    command += data.toString();
    // console.log(`client id connected: ${id}`)

    if (command.includes("\n")) {
      let parts: string[] = [];

      if(command.startsWith("*")){
        parts = parser(command);
      }else{
         parts = command.trim().split(" ");
      }

      command = "";
 
      const cmd = parts[0]?.toUpperCase();

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

const port = 6379;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});




// const testCommand = "*3\r\n$3\r\nSET\r\n$4\r\nname\r\n$7\r\nutkarsh\r\n";
// console.log(parser(testCommand));