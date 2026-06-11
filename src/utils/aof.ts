import fs from "fs";
import type { StoredValue } from "../models/db.js";


export const appendToAOF = (
  command: string,
  ...args: string[]
): void => {
  try {

    const line = [command,...args].join(" ")+"\n";
    fs.appendFileSync("aof.log",line,"utf-8");

  } catch (error) {
    console.error("Error appending to AOF:", error);
  }
};


export const loadAOF = (
  db: Map<string, StoredValue>,
  filepath: string = "aof.log"
): void => {
  try {

    if(!fs.existsSync(filepath)){
        console.log(`AOF file ${filepath} does not exist. Starting with empty database.`);
        return;
    }

  
    const fileContent = fs.readFileSync(filepath,"utf-8");

    const lines = fileContent.split("\n");
    for(const line of lines){
        if(line.trim() === "") continue;
        const parts = line.trim().split(" ");
        if(!parts[0]) continue; 
        const command = parts[0].toUpperCase();

        switch(command){
            case "SET":
                const key = parts[1];
                const value = parts.slice(2).join(" ");
                if(!key || !value) continue;
                db.set(key, { value });
                break;
            case "DEL":
                const delKey = parts[1];
                if(!delKey) continue;
                db.delete(delKey);
                break;
            case "MSET":
                if (parts.length < 3 || parts.length % 2 === 0) continue;
                for (let i = 1; i < parts.length; i += 2) {
                    const key = parts[i];
                    const value = parts[i + 1];
                    if (!key || !value) continue;
                    db.set(key, { value });
                }
                break;
            case "FLUSHDB":
                db.clear();
                break;
            case "EXPIRE":
                const expKey = parts[1];
                const seconds = parseInt(parts[2]!, 10);
                if (!expKey || isNaN(seconds)) continue;
                const storedValue = db.get(expKey);
                if (!storedValue) continue;
                const expireAt = Date.now() + (seconds * 1000);
                db.set(expKey, { ...storedValue, expireAt });
                break;
        }


    }

    console.log(`AOF loaded from ${filepath}`);
  } catch (error) {
    console.error("Error loading AOF:", error);
  }
};
