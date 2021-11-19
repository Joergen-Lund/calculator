const screen = document.querySelector('.screen')
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const allClearButton = document.querySelector('[data-all-clear]')
const evaluateButton = document.querySelector('[data-evaluate]')


let expressionArray = []
let expression = ""
let currentNumber = ""

// indicates what parenthesis we can use
let allowStartOfparenthesis = true
let allowEndOfparenthesis = true


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

        // if (currentNumber != "" || operationButton.value == "(" || operationButton.value == ")" || operationButton.value == "-" || operationButton.value == "!") {

            currentNumber != "" ? expressionArray.push(currentNumber) : ""



            if (operationButton.value != "(" && operationButton.value != ")" && operationButton.value != "square" && operationButton.value != "!") {

                // if (isset(lastOperation) && lastOperation == "") {
                    
                // }
                expressionArray.push(operationButton.value)
                expression += ` ${operationButton.value} `

            } else if ((operationButton.value == "(" && allowStartOfparenthesis) || (operationButton.value == ")" && allowEndOfparenthesis)) {

                if (currentNumber != "" && operationButton.value == "(") {
                    expressionArray.push("*")
                    expression += " * "
                }

                expressionArray.push(operationButton.value)
                expression += ` ${operationButton.value} `

                if (allowStartOfparenthesis) {
                    allowStartOfparenthesis = true
                    allowEndOfparenthesis = true
                } else {
                    allowEndOfparenthesis = true

                }
            } else if (operationButton.value == "square" && currentNumber != "") {
                expressionArray.push(operationButton.value)
                expression += "<sup>2</sup>"
            } else if (operationButton.value == "!") {
                currentNumber = parseFloat(currentNumber)
                if (!Number.isInteger(currentNumber)) return
                

                expressionArray.push(operationButton.value)
                expression += `${operationButton.value} `
            }
            
            currentNumber = ""
            
            
    
            screen.innerHTML = expression
            // let lastOperation = operationButton.value
        // }
    })
})

allClearButton.addEventListener('click', () => {

    expressionArray = []
    expression = ""
    currentNumber = ""

    allowStartOfparenthesis = true
    allowEndOfparenthesis = false

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
    let fixingParenthesis = false
    let tempArray, indexOfStartParenthesis

    while (notSplitted) {

        if (expressionArray.indexOf("(") != -1 && expressionArray.indexOf(")") != -1) {
            fixingParenthesis = true
            indexOfStartParenthesis = expressionArray.indexOf("(")
            let indexOfEndParenthesis = expressionArray.indexOf(")")
            let numberOfItemsToRemove = indexOfEndParenthesis - indexOfStartParenthesis + 1

            tempArray = expressionArray
            expressionArray = []
            // tempArray.splice(indexOfStartParenthesis, numberOfItemsToRemove)
            expressionArray = tempArray.splice(indexOfStartParenthesis, numberOfItemsToRemove)
            expressionArray.shift()
            expressionArray.pop()
            console.log(expressionArray)
        }

        else if (expressionArray.indexOf("!") != -1) {
            console.log("factorial")
            let indexOfFactorial = expressionArray.indexOf("!")

            let base = expressionArray[indexOfFactorial - 1]
            base = parseFloat(base)

            expressionArray.splice(indexOfFactorial - 1, 2, factorial(base))
            console.log(expressionArray)
        } else if (expressionArray.indexOf("square") != -1) {
            console.log("square")
            let indexOfSquare = expressionArray.indexOf("square")

            let base = expressionArray[indexOfSquare - 1]
            base = parseFloat(base)

            expressionArray.splice(indexOfSquare - 1, 2, square(base))
            console.log(expressionArray)
        }

        // check if the expression includes multiplication or division
        else if (expressionArray.indexOf("*") != -1 || expressionArray.indexOf("÷") != -1) {

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
                
                if (expressionArray[indexOfSubtraction - 1] == undefined) {
                    expressionArray.unshift(0)
                } 

                setTimeout(() => {
                    
                    let number1 = expressionArray[indexOfSubtraction - 1]
                    number1 = parseFloat(number1)
                    
                    let number2 = expressionArray[indexOfSubtraction + 1]
                    number2 = parseFloat(number2)

                    expressionArray.splice(indexOfSubtraction - 1, 3, number1 - number2)
                }, 5);

        
                console.log(expressionArray)
            }
            
        } else if (fixingParenthesis) {
            fixingParenthesis = false

            let answerOfParenthesis = expressionArray[0]
            expressionArray = tempArray
            expressionArray.splice(indexOfStartParenthesis, 0, answerOfParenthesis)
            console.log(expressionArray)
        }
         else {

            // makes sure nothing went wrong, and prevents the display from showing "undefined" if nothing is entered before hitting the evaluateButton
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
    let number1IsNegative = false
    let number2IsNegative = false

    number1 < 0 ? number1IsNegative = true : ""
    number2 < 0 ? number2IsNegative = true : ""

    number1 = Math.abs(number1)
    number2 = Math.abs(number2)


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


    // if one the numbers passed in was negative, make the product negative
    if (!(number1IsNegative && number2IsNegative) && (number1IsNegative || number2IsNegative)) {
        product = "-" + product
        product = parseFloat(product)
    }


    return product
}


function divide(dividend, divisor) {

    let quotient = 0
    let dividendIsNegative = false
    let divisorIsNegative = false

    dividend < 0 ? dividendIsNegative = true : ""
    divisor < 0 ? divisorIsNegative = true : ""

    dividend = Math.abs(dividend)
    divisor = Math.abs(divisor)


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
    

    // if one the numbers passed in was negative, make the quotient negative
    if (!(dividendIsNegative && divisorIsNegative) && (dividendIsNegative || divisorIsNegative)) {
        quotient = "-" + quotient
        quotient = parseFloat(quotient)
    }

    return quotient
}

function square(base) {

    return multiply(base, base)

}

function factorial(base) {

    if (base < 0 || !Number.isInteger(base)) return


    let answer = 1

    for (let i = base; i > 0; i--) {

        answer = multiply(answer, i)
    
    }

    return answer
}


