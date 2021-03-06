import { reactive, createState } from "./reactivity.js"
import { Chart, getRandomInt } from "./utils.js";

customElements.define('chart-div', Chart)

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


const bubbleChart = document.querySelector('chart-div');
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
