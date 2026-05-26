export default function parser(command:string):string[]{
  const parts = command.split("\r\n");
  const result:string[] = [];
  for(let i=2 ; i<parts.length; i+=2){
    result.push(parts[i]!) 
  }
  return result;
}


export const commandParser = (data: Buffer) => {
  return data
    .toString()
    .split("\r\n")
    .filter((c) => !c.startsWith("*") && !c.startsWith("$") && c !== "");
};

