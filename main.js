const screen = document.querySelector('.screen')
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const allClearButton = document.querySelector('[data-all-clear]')
const evaluateButton = document.querySelector('[data-evaluate]')

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

allClearButton.addEventListener('click', () => {
    console.log(allClearButton.innerHTML)
})

evaluateButton.addEventListener('click', () => {
    console.log(evaluateButton.innerHTML)
})



// let expression = ""





function multiply(number1, number2) {

    let product = 0

    // if both numbers passed in is floats, multiply to get 5 decimalpoints accuracy
    if (!Number.isInteger(number1) && !Number.isInteger(number2)) {

        number2 = multiply(number2, 100000)

        for (let i = 0; i < number2; i++) {
            product += number1
        }

        product = divide(product, 100000)


        return product
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


function divide(dividend, divisor) {

    let quotient = 0


    while (dividend - divisor >= 0) {
        dividend -= divisor
        quotient++
    }

    dividend = multiply(dividend, 10)
    while (dividend - divisor >= 0) {
        dividend -= divisor
        quotient += 0.1
    }

    dividend = multiply(dividend, 10)
    while (dividend - divisor >= 0) {
        dividend -= divisor
        quotient += 0.01
    }

    dividend = multiply(dividend, 10)
    while (dividend - divisor >= 0) {
        dividend -= divisor
        quotient += 0.001
    }

    dividend = multiply(dividend, 10)
    while (dividend - divisor >= 0) {
        dividend -= divisor
        quotient += 0.0001
    }
    
    dividend = multiply(dividend, 10)
    while (dividend - divisor >= 0) {
        dividend -= divisor
        quotient += 0.00001
    }

    quotient = quotient.toFixed(5)
    quotient = parseFloat(quotient)
    

    return quotient
}

console.log(multiply(25,10.5))
console.log(multiply(50.34, 64.1))

console.log(divide(110,10))
console.log(divide(100, 20.5))
