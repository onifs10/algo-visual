import { reactive, createState } from "./reactivity.js"
import { Chart, getRandomInt } from "./utils.js";

customElements.define('chart-div', Chart)

function* heapSort (array, snap){
    createMaxHeap(array, snap);
    snap && snap();
    yield false;
    for (let i = array.length - 1; i > 0; i--) {
        swap(0, i, array, snap);
        yield false;
        heapify(array, 0, i, snap);
        yield false;
    }
    yield true;
};

function createMaxHeap(array, snap) {
  // code
  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
    heapify(array, i, array.length - 1, snap);
  }
  return array;
};

const heapify = (array, index, heapSize, snap) => {
  // code
  const left = 2 * index + 1;
  const right = 2 * index + 2;
  if (right < heapSize) {
    if (array[right] && array[index] < array[right]) {
      swap(index, right, array, snap);
      heapify(array, right, heapSize, snap);
    }
  }
  if (left < heapSize) {
    if (array[left] && array[index] < array[left]) {
      swap(index, left, array, snap);
      heapify(array, left, heapSize, snap);
    }
  }
};

const swap = (index1, index2, array, snap) => {
    [array[index1], array[index2]] = [array[index2], array[index1]];
    snap && snap()
};





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
let sorting = heapSort(array.value, snap);

let id;

const play = () => { 
    if (done.value) {
        array.value = [];
        done.value = !done.value;
        snapState.value = 0;
        addNumbers()
        sorting = heapSort(array.value, snap)
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


