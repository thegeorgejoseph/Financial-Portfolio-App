export function updateLocal(key:string, value:any):void{
    localStorage.setItem(key,JSON.stringify(value))
}

export function getLocal(key:string):any{
    let value = localStorage.getItem(key);
    if(!value){
        value="false"
    }
    let cState=JSON.parse(value);
    return cState
}

export function remove(key:string):any{
  localStorage.removeItem(key)
}
