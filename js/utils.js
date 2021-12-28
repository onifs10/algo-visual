/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export class Chart extends HTMLElement{
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

