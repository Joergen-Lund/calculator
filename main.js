const screen = document.querySelector('.screen')
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const allClearButton = document.querySelector('[data-all-clear]')
const evaluateButton = document.querySelector('[data-evaluate]')


let expressionArray = []
let expression = ""
let currentNumber = ""


numberButtons.forEach(numberButton => {
    numberButton.addEventListener('click', () => {
        console.log(numberButton.innerHTML)

        currentNumber += numberButton.innerHTML

        expression += numberButton.innerHTML

        screen.innerHTML = expression
    })
})

operationButtons.forEach(operationButton => {
    operationButton.addEventListener('click', () => {
        console.log(operationButton.value)

        if (currentNumber != "") {

            expressionArray.push(currentNumber)
            expressionArray.push(operationButton.value)
            currentNumber = ""

            expression += ` ${operationButton.value} `
    
            screen.innerHTML = expression

        }
    })
})

allClearButton.addEventListener('click', () => {
    expression = ""
    currentNumber = ""
    expressionArray = []
    screen.innerHTML = "0"
})

evaluateButton.addEventListener('click', () => {
    console.log(evaluateButton.innerHTML)

    expressionArray.push(currentNumber)

    console.log(expressionArray)

    evaluate()
})


function evaluate() {
    
    if (expressionArray.indexOf("*") != -1) {
        console.log("has *")

        let indexOfMultiplication = expressionArray.indexOf("*")
        console.log(indexOfMultiplication)

        let number1 = expressionArray[indexOfMultiplication - 1]
        number1 = parseFloat(number1)
        console.log(number1)
        let number2 = expressionArray[indexOfMultiplication + 1]
        number2 = parseFloat(number2)
        console.log(number2)

        console.log(multiply(number1, number2))

    } else if (expressionArray.indexOf("÷") != -1) {
        console.log("has ÷")

        let indexOfMultiplication = expressionArray.indexOf("÷")
        console.log(indexOfMultiplication)

        let number1 = expressionArray[indexOfMultiplication - 1]
        number1 = parseFloat(number1)
        console.log(number1)
        let number2 = expressionArray[indexOfMultiplication + 1]
        number2 = parseFloat(number2)
        console.log(number2)

        console.log(multiply(number1, number2))
    }

}




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

function pow(base) {

    return multiply(base, base)

}

function sqrt(base) {
    let exponent = divide(base, 2)

    return pow(base, exponent)
}

