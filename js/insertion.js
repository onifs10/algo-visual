import { reactive, createState } from "./reactivity.js"
import { Chart, getRandomInt } from "./utils.js";

customElements.define('chart-div', Chart)


function* insertionSort(nums, snap) {
  // code goes here
  if (nums.length === 0) {
    return nums;
  }
  let i = 1;
  let j = 0;
  do {
    j = i;
    do {
      // swaping backwards from index i
      if (nums[j] < nums[j - 1]) {
          [nums[j], nums[j - 1]] = [nums[j - 1], nums[j]];
          snap && snap()
          yield false
          j -= 1;
      } else {
        j = 0;
      }
    } while (j !== 0);
    i += 1;
  } while (i < nums.length);
    yield true;
}

const ChartDiv = document.querySelector('chart-div');
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
    ChartDiv.addCount(snapState.value)
    ChartDiv.clear()
    for (let i = 0; i <= array.value.length; i++){
        let newDiv = document.createElement('div');
        newDiv.setAttribute('style' , `--height: ${array.value[i]}%`)
        ChartDiv.addDiv(newDiv)   
    }
})

const snap = () => {
    snapState.value++
}
let sorting = insertionSort(array.value, snap);

let id;

const play = () => { 
    if (done.value) {
        array.value = [];
        done.value = !done.value;
        snapState.value = 0;
        addNumbers()
        sorting = insertionSort(array.value, snap)
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
