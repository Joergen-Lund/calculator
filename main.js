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



function multiply(number1, number2) {
    // sets the the initial product as 0
    let product = 0

    // if both numbers passed in is floats, terminate multiply() and execute multiplyFloats()
    if (!Number.isInteger(number1) && !Number.isInteger(number2)) {
        return multiplyFloats(number1, number2)
    }    
    
    // if number2 is a float, swap the values of number1 and number2
    if (!Number.isInteger(number2)) {
        let temp = number2
        number2 = number1
        number1 = temp
    }

    for (let i = 0; i < number2; i++) {
        product += number1
    }

    return product
}

function multiplyFloats(number1, number2) {
    // multiplies the number to get 4 decimal accuracy when we round the number
    number1 = multiply(number1, 10000)
    number1 = Math.round(number1)
    number1 = divide(number1, 10000)


    number2 = multiply(number2, 10000)
    number2 = Math.round(number2)

    console.log("number1: " + number1 + "   number2: " + number2)

    return "multiply " + number1 + " and " + number2
}

function divide(dividend, divisor) {
    // sets the the initial quotient as 0
    let quotient = 0

    i = 0
    while (i < 100000) {
        if (dividend == 0) {
            break
        }
        if (dividend - divisor >= 0) {
            dividend -= divisor
            quotient++
        } else if (dividend > 0) {
            
        }


        i++
    }

    return quotient
}

function divideFloats(dividend, divisor) {
    
}


console.log(multiply(50.1234, 64.1))

console.log(divide(110,10))