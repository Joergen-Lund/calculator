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

    if (currentNumber != "") {
        expressionArray.push(currentNumber)
    }

    console.log(expressionArray)

    evaluate()
})


function evaluate() {

    let notSplitted = true

    while (notSplitted) {
        // check if the expression includes multiplication or division
        if (expressionArray.indexOf("*") != -1 || expressionArray.indexOf("÷") != -1) {

            // if there is multiplication in the expression, set indexOfMultiplication to the index in the array. Else set it to 1000, to ensure that the next if-statement runs properly
            let indexOfMultiplication = expressionArray.indexOf("*") != -1 ? expressionArray.indexOf("*") : 1000

            // if there is division in the expression, set indexOfDivision to the index in the array. Else set it to 1000, to ensure that the next if-statement runs properly
            let indexOfDivision = expressionArray.indexOf("÷") != -1 ? expressionArray.indexOf("÷") : 1000


            // if indexOfMultiplication is lower than indexOfDivision it means that multiplication comes before division in the expression. To follow the order of operations, we execute the multiplication first
            if (indexOfMultiplication < indexOfDivision) {
                console.log("multiplication")

                let number1 = expressionArray[indexOfMultiplication - 1]
                number1 = parseFloat(number1)

                let number2 = expressionArray[indexOfMultiplication + 1]
                number2 = parseFloat(number2)

                // expressionArray.splice(indexOfMultiplication - 1, 3)
                // expressionArray.splice(indexOfMultiplication - 1, 0, multiply(number1, number2))
                expressionArray.splice(indexOfMultiplication - 1, 3, multiply(number1, number2))
        
                console.log(expressionArray)
            } else {
                console.log("division")
                let number1 = expressionArray[indexOfDivision - 1]
                number1 = parseFloat(number1)
                let number2 = expressionArray[indexOfDivision + 1]
                number2 = parseFloat(number2)

                expressionArray.splice(indexOfDivision - 1, 3, divide(number1, number2))
        
                console.log(expressionArray)
            }
            
    
        } else if (expressionArray.indexOf("+") != -1 || expressionArray.indexOf("-") != -1) {
            
            let indexOfAddition = expressionArray.indexOf("+") != -1 ? expressionArray.indexOf("+") : 1000
            let indexOfSubtraction = expressionArray.indexOf("-") != -1 ? expressionArray.indexOf("-") : 1000

            if (indexOfAddition < indexOfSubtraction) {
                console.log("addition")

                let number1 = expressionArray[indexOfAddition - 1]
                number1 = parseFloat(number1)
                let number2 = expressionArray[indexOfAddition + 1]
                number2 = parseFloat(number2)

                expressionArray.splice(indexOfAddition - 1, 3, number1 + number2)
        
                console.log(expressionArray)
            } else {
                console.log("subtraction")
                let number1 = expressionArray[indexOfSubtraction - 1]
                number1 = parseFloat(number1)
                let number2 = expressionArray[indexOfSubtraction + 1]
                number2 = parseFloat(number2)

                expressionArray.splice(indexOfSubtraction - 1, 3, number1 - number2)
        
                console.log(expressionArray)
            }
            
        } else {

            // makes sure nothing went wrong, and prevents the display from showing "undefined" if nothing is entered before hitting evaluateButton
            if (expressionArray.length == 1) {

                // the answer is the last number in the expressionArray
                let answer = expressionArray[0]
                screen.innerHTML = answer

            } 
            // stops the while-loop
            notSplitted = false
        }
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

function factorial(base) {

    let answer = 1

    for (let i = base; i > 0; i--) {

        answer = multiply(answer, i)
    
    }

    return answer
}

console.log(factorial(5))
