const getLocalStorageObject = (key) => {
  let tObj = localStorage.getItem(key);
  if(tObj && tObj!==null){
    let val = null;
    try {
      val = JSON.parse(tObj);
    } catch (e){
      console.warn("Error parsing local storage object",e);
      val = tObj;
    }
    return val;
  } 
}

const setLocalStorageObject = (key, obj) => {
  if(!obj || obj === null ){
    obj = "";
  } if(typeof obj === "string"){
    localStorage.setItem(key, obj);
  } else {
    localStorage.setItem(key, JSON.stringify(obj));
  }
}

export default { getLocalStorageObject, setLocalStorageObject };