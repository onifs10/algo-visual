import { createState, reactive } from "./reactivity.js";

// do not set the reactive property in a reactive environment
const rootDiv = document.getElementById("root");

//==> states <==//
let b = createState(1) // returns a reactive object with property value
let objectState = createState({ test: "like" })
// create count element
const countDiv = document.createElement('div');
countDiv.classList.add('countDiv') 

// add button
const addButton = document.createElement('button');
addButton.classList.add('add')
addButton.innerText = "+";
// sub button

const subButton = document.createElement('button');
subButton.classList.add('sub')
subButton.innerText = "-";


addButton.onclick = () => {
    b.value++
}
subButton.onclick = () => {
    b.value--
}



let indexOne;

// similar to useEffect in react but dependencies is fdefined by trhe getter and setters in the states
reactive(() => {
    countDiv.innerText = b.value
    indexOne = objectState.value.test
})


// mount elements to dom
rootDiv.appendChild(countDiv);
let buttonContainer = document.createElement('div');
buttonContainer.appendChild(subButton);
buttonContainer.appendChild(addButton);
rootDiv.appendChild(buttonContainer)

