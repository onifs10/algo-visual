import { reactive, createState } from "./reactivity.js"
import { getRandomInt } from "./utils.js";

function* bubbleSort(nums, snap) {
  let swap = false;
  let iteration = 0;
  do {
    swap = false;
      for (let i = 0; i < nums.length - (1 + iteration); i++) {
        // snap shot
        yield false;
        if (nums[i] > nums[i + 1]) {
        [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
        snap && snap()
        swap = true;
      }
    }
    iteration += 1;
  } while (swap);
    yield true;
}

class Bubble extends HTMLElement{
    constructor() {
        super();   
        this.attachShadow({ mode: "open" })

        //create box
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper')
        const snapCount = document.createElement('div');
        snapCount.classList.add('count')

        //style
        const styleElement = document.createElement('style');
        styleElement.textContent = /*css*/ `
            *{
                box-sizing :  border-box; 
            }
            .wrapper {
                margin:0 auto;
                min-width : 300px;
                max-width : 600px;
                width: 100%;
                height : 400px;
                max-height: 400px;
                display : flex;
                /* flex-flow: row nowrap; */
                align-items: flex-end;
                /* background-color: tr; */
                border: 1px solid green;
                border-radius: 11px;
                padding: 10px;
                overflow-x: auto;
    
            } 
            .count{
                margin:0 auto;
                min-width : 300px;
                max-width : 600px;
                width: 100%;
                padding:.5rem;
            }
            .wrapper div {
                --height : 100%;
                border-radius : 5px;
                min-width : 3px;
                height: var(--height);
                background-color: red;
                transition : all 500ms ease-in-out;
                margin: 0 .25rem;
            }
        `

        //attach style and shadow elements
        this.styleElement = styleElement;
        this.shadowElement = wrapper;
        this.snapCount = snapCount;
        this.shadowRoot.append(styleElement, wrapper, snapCount);
    }

    addDiv = (...div) => {
        this.shadowElement.append(...div)
    }
    clear = () => {
        this.shadowElement.replaceChildren()
    }
    addCount = (value) => {
        this.snapCount.innerText = value;
    }
}


customElements.define('bubble-div', Bubble)
const bubbleChart = document.querySelector('bubble-div');
const button = document.querySelector('button')
const array = createState([]);
const snapState = createState(0);
const playing = createState(false);
const done = createState(false);

const addNumbers = () => {
    for (let i = 0; i <= 100; i += 2){
    array.value.push(getRandomInt(1,100))
    }
}
addNumbers();

reactive(() => {
    bubbleChart.addCount(snapState.value)
    bubbleChart.clear()
    for (let i = 0; i <= array.value.length; i++){
        let newDiv = document.createElement('div');
        newDiv.setAttribute('style' , `--height: ${array.value[i]}%`)
        bubbleChart.addDiv(newDiv)   
    }
})

const snap = () => {
    snapState.value++
}
let sorting = bubbleSort(array.value, snap);

let id;

const play = () => { 
    if (done.value) {
        array.value = [];
        done.value = !done.value;
        snapState.value = 0;
        addNumbers()
        sorting = bubbleSort(array.value, snap)
    }
    if (id) return;
    id = setInterval(() => {
    let value =  sorting.next().value
    if (value) {
        clearInterval(id)
        id = null
        playing.value = false;
        done.value = true;
        button.innerText = "restart"
    }  
}, 10)

}

const pause = () => {
    if (!id) return;
    clearInterval(id)
    id = null
}

button.addEventListener("click", () => {
    if (playing.value) {
        pause()
        playing.value = !playing.value;
        button.innerText = "play"
    } else {
        play()
        playing.value = !playing.value;
        button.innerText = "pause"
    }
})
