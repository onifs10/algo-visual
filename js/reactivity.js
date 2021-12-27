window.observe = (obj) =>  {
  let dep = new window.Dep();
  for(propName in obj){
    let realValue = obj[propName];
    Object.defineProperty(obj, propName, {
      get (){
        dep.depend();
        return realValue;
      },
      set(newValue){
        realValue = newValue;
        dep.notify();
      } 
    });
  }
}

window.Dep = class Dep {
    constructor(){
        this.subscribers = new Set();
  }

  depend() {
    if(activeUpdate){
        this.subscribers.add(activeUpdate);
    }
  }

  notify(){
      this.subscribers.forEach(sub => sub());
  }
}

let activeUpdate;

window.reactive = (update) =>  {
  function wrappedUpdate (){
    activeUpdate =  wrappedUpdate;        
    update()
    activeUpdate = null;
  }
  wrappedUpdate();
}

window.createState = (value) => {
    const reactiveObject = {
        value
    }
    observe(reactiveObject);
    return reactiveObject
}
 

