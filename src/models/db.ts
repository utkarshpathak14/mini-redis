
export type StoredValue = {
    value:string,
    expireAt?:number 
}


export const db = new Map<string, StoredValue>();
