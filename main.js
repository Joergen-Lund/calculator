// import Calculator from "./Calculator"

const screen = document.querySelector('.screen')
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const allClearButton = document.querySelector('[data-all-clear]')
const equalsButton = document.querySelector('[data-equals]')

numberButtons.forEach(numberButton => {
    numberButton.addEventListener('click', () => {
        console.log(numberButton.innerHTML)
    })
})

operationButtons.forEach(operationButton => {
    operationButton.addEventListener('click', () => {
        console.log(operationButton.value)
    })
})