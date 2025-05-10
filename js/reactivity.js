// array reactivity similar to that in vuejs code base;
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
*/
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.defineArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})


/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

const observe = (obj) => {
  let dep = new Dep();

  const thisObj = {
    dep,
    defineProps,
    defineArray 
  }
  function defineProps(obj) {
    for(let propName in obj){
      let realValue = obj[propName];
      Object.defineProperty(obj, propName, {
        get (){
          dep.depend();
          return realValue;
        },
        set(newValue){
          realValue = newValue;
          if (typeof realValue === 'object' && !Array.isArray(realValue) && realValue !== null) {
            defineProps(realValue)
          } else if (Array.isArray(realValue)) {
            defineArray(realValue)
          }
          dep.notify();
        } 
      });
      if (typeof realValue === 'object' && !Array.isArray(realValue) && realValue !== null) {
        defineProps(realValue)
      } else if (Array.isArray(realValue)) {
          defineArray(realValue)
      }
    }  
  }

  function defineArray(array) {
    array.__proto__ = arrayMethods
    def(array, "__ob__", thisObj)
    for (let item of array) {
      if (typeof item === 'object' && !Array.isArray(item) && item !== null) {
        defineProps(item)
      } else if (Array.isArray(item)) {
          defineArray(item)
      }
    }
  }

  defineProps(obj)
}

class Dep {
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

export const reactive = (update) =>  {
  function wrappedUpdate (){
    activeUpdate =  wrappedUpdate;        
    update()
    activeUpdate = null;
  }
  wrappedUpdate();
}

export const createState = (value) => {
    const reactiveObject = {
        value
    }
    observe(reactiveObject);
    return reactiveObject
}
 




