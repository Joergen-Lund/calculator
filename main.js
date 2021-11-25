const lastExpressionScreen = document.querySelector('.last-expression')
const screen = document.querySelector('.screen')
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const allClearButton = document.querySelector('[data-all-clear]')
const evaluateButton = document.querySelector('[data-evaluate]')
const historyContainer = document.querySelector('.history_container')
const clearHistoryButton = document.querySelector('.clear-history')
const errorContainer = document.querySelector('.error-container')


let validButtons = ["+", "-", "*", "/", "(", ")", "Enter", "Backspace", "!"];
let expressionArray = []
let expression = ""
let currentNumber = ""

// for storing potensial error messages
let error = ""


// currently we can't add parentheses inside a pair of parentheses, due to how the evaluate() is set up. ex. (5 (1+2)) (1 + 2)
// indicates what parentheses we can use
let allowStartOfParenthesis = true
let allowEndOfParenthesis = false


// if we want to calculate 5 * - 6, this wouldn't work with the way we have set up the evaluate() and the expressionArray. To get around this we add 5 * (0 - 6) in the code, and 5 * - 6 in the UI.
// the following boolean tells us when we should close off the parentheses
let closeParenthesisAfterNextNumber = false

// let chooseExponent = true
let sqrtOfNextNumber = false


numberButtons.forEach(numberButton => {
    numberButton.addEventListener('click', () => inputNumber(numberButton.innerHTML))
})

document.addEventListener("keydown", e => {
    console.log(e.key)
    if(e.key == "Enter") {
        e.preventDefault()
    }
    if(Number.isInteger(Number.parseInt(e.key)) || e.key == ".") {
        inputNumber(e.key)
    }else if(validButtons.includes(e.key)) {
        inputOperation(e.key)
    }
})

operationButtons.forEach(operationButton => {
    operationButton.addEventListener('click', () => {
        console.log(operationButton.value)
        inputOperation(operationButton.value)
    })
})

allClearButton.addEventListener('click', () => {

    expressionArray = []
    expression = ""
    currentNumber = ""

    error = ""
    displayError()

    allowStartOfParenthesis = true
    allowEndOfParenthesis = false

    lastExpressionScreen.style.visibility = "hidden"
    screen.innerHTML = "0"

})

evaluateButton.addEventListener('click', () => inputOperation("Enter"))

clearHistoryButton.addEventListener('click', clearHistory)


function inputOperation(input) {

    // currentNumber != "" ? expressionArray.push(currentNumber) : ""
    if (currentNumber != "") {
        expressionArray.push(currentNumber)

        if (closeParenthesisAfterNextNumber) {
            expressionArray.push(")")
            closeParenthesisAfterNextNumber = false
        }
    }


    switch(input) {

        case "Enter":
            
            evaluate()
            
            break

        case "Backspace":
            
            expressionArray.pop()            

            // todo: fix this
            expression = expressionArray.length > 0 ? expressionArray.join(" ").toString() : "0"
            // expression += " "
            
            
            break

        case "(":
            if (allowStartOfParenthesis) {

                if (currentNumber != "" || expressionArray[expressionArray.length - 1] == ")" || expressionArray[expressionArray.length - 1] == "!") {
                    expressionArray.push("×")
                    expression += " × "
                }
                
                expression += ` ${input} `
                
                console.log(currentNumber)
                expressionArray.push(input)
                

                allowStartOfParenthesis = !allowStartOfParenthesis
                allowEndOfParenthesis = !allowEndOfParenthesis

            }
            

            break

        case ")":
            if (allowEndOfParenthesis) {

                expressionArray.push(input)
                expression += ` ${input} `
    
                allowStartOfParenthesis = !allowStartOfParenthesis
                allowEndOfParenthesis = !allowEndOfParenthesis
    
            }

            break

        case "square":

            expressionArray.push(input)
            expression += "<sup>2</sup> "
            
            break

        case "sqrt":

            if (currentNumber != "") {
                expressionArray.push("×")
                expression += " × "

                currentNumber = ""
            }

            expressionArray.push("sqrt")
            expression += ` &radic; `

            sqrtOfNextNumber = true


            inputOperation("(")
            
            break

        case "!":

            expressionArray.push(input)
            expression += "! "
    
            
            break

        case "*":
            input = "×"

            expressionArray.push(input)
            // expression += ` &times; `
            expression += ` × `
    

            break
        
        case "/":
            input = "÷"

            expressionArray.push(input)
            expression += ` &divide; `
    

            break

        case "-":
            const values = ["×", "÷", "+"]
            if (values.includes(expressionArray[expressionArray.length - 1]) || expressionArray.length == 0) {
                console.log(expressionArray)
                expressionArray.push("(")
                console.log(expressionArray)
                expressionArray.push(0)
                console.log(expressionArray)
                expressionArray.push(input)
                console.log(expressionArray)

                closeParenthesisAfterNextNumber = true
            } else {
                expressionArray.push(input)
            }
            expression += ` &minus; `
    

            break

        default:
                expressionArray.push(input)
                expression += ` ${input} `
        
 
            break
    }

    currentNumber = ""
    if (input != "Enter") {
        expression = expression.replace("-", "&minus; ")
        
        expression ? screen.innerHTML = expression : "0"
        
    }

}

function inputNumber(input) {

    if (expressionArray[expressionArray.length - 1] == ")") {
        expressionArray.push("×")
        expression += " × "
    }

    currentNumber += input
    expression == "0" ? expression = input : expression += input
    
    screen.innerHTML = expression
}

//appends the expression and answer to the history tab
function appendHistory(expression, answer) {
    const div = document.createElement("div")
    div.setAttribute("title", "venstreklikk for å legge til svar, høyreklikk for å legge til uttrykk")
    div.addEventListener("click", historyClick)
    div.addEventListener("contextmenu", historyClick)
    const spanExp = document.createElement("span")
    spanExp.setAttribute("data-expression", "")
    spanExp.innerHTML = expression

    const spanAns = document.createElement("span")
    spanAns.setAttribute("data-answer", "")
    spanAns.innerHTML = `= ${answer}`

    div.appendChild(spanExp)
    div.appendChild(spanAns)
    historyContainer.appendChild(div)

    historyContainer.scrollTo(0, historyContainer.scrollHeight)
}


function historyClick(event) {
    console.log(event.type)
    const historyExp = event.target.querySelector("[data-expression]").innerText
    let answer = event.target.querySelector("[data-answer]").innerText
    answer = answer.substring(1, answer.length) // removes the "="-sign from the expression

    if(event.type == "click") { //handles left click
        // TODO: better solutions to handle negative numbers when adding them to the expression?
        if(answer < 0) {

            expressionArray.push("(")
            console.log(expressionArray)
            expressionArray.push(0)
            console.log(expressionArray)
            expressionArray.push("-")
            expression += " &minus; "
            console.log(expressionArray)

            closeParenthesisAfterNextNumber = true
        }
        // if (expressionArray.length > 0) {
        //     inputOperation("+")
        // }
        inputNumber(Math.abs(answer))

    }else { //handles right click
        event.preventDefault()

        currentNumber = ""
        expression += historyExp
        expressionArray = expressionArray.concat(expression.split(" "))
        console.log(expression.split(" "))
        screen.innerHTML = expression
        console.log(expressionArray)
    }
    

    console.log(historyExp, answer)

}

function clearHistory() {
    historyContainer.innerHTML = ""
}





function evaluate() {

    console.log(expressionArray)

    // for the history tab
    // let historyExpression = expressionArray.join(" ")
    let historyExpression = expression


    lastExpressionScreen.innerHTML = expression
    lastExpressionScreen.style.visibility = 'visible'

    let notSplitted = true
    let fixingParentheses = false
    let tempArray, indexOfStartParenthesis

    while (notSplitted) {

        // if the expression includes a value of "infinity", we won't be able to solve the equation. Therefore we set the expressionArray to a single value of "infinity", and the function will go to the else at the end of evaluate() and display the value, and add to history
        if (expressionArray.indexOf("infinity") != -1) {    
            expressionArray = ["infinity"]
        }

        if (expressionArray.indexOf("(") != -1) {
            fixingParentheses = true
            indexOfStartParenthesis = expressionArray.indexOf("(")
            let indexOfEndParenthesis = expressionArray.indexOf(")") != -1 ? expressionArray.indexOf(")") : expressionArray.length - 1
            let numberOfItemsToRemove = indexOfEndParenthesis - indexOfStartParenthesis + 1

            // let checkArray = expressionArray.splice(indexOfStartParenthesis, numberOfItemsToRemove)

            tempArray = expressionArray
            expressionArray = []
            // tempArray.splice(indexOfStartParenthesis, numberOfItemsToRemove)
            expressionArray = tempArray.splice(indexOfStartParenthesis, numberOfItemsToRemove)
            expressionArray.shift()

            if (expressionArray.indexOf(")") != -1) expressionArray.pop()
            
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
            console.log(expressionArray)
            expressionArray.splice(indexOfSquare - 1, 2, square(base))
            console.log(expressionArray)
        } else if (expressionArray.indexOf("sqrt") != -1) {
            console.log("squareRoot")
            let indexOfSquareRoot = expressionArray.indexOf("sqrt")

            let base = expressionArray[indexOfSquareRoot + 1]
            base = parseFloat(base)
            console.log(expressionArray)
            expressionArray.splice(indexOfSquareRoot, 2, squareRoot(base))
            console.log(expressionArray)
        }

        // check if the expression includes multiplication or division
        else if (expressionArray.indexOf("×") != -1 || expressionArray.indexOf("÷") != -1) {

            // if there is multiplication in the expression, set indexOfMultiplication to the index in the array. Else set it to 1000, to ensure that the next if-statement runs properly
            let indexOfMultiplication = expressionArray.indexOf("×") != -1 ? expressionArray.indexOf("×") : 1000

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

                // setTimeout(() => {
                    
                    let number1 = expressionArray[indexOfSubtraction - 1]
                    number1 = parseFloat(number1)
                    
                    let number2 = expressionArray[indexOfSubtraction + 1]
                    number2 = parseFloat(number2)

                    expressionArray.splice(indexOfSubtraction - 1, 3, number1 - number2)
                // }, 5)

        
                console.log(expressionArray)
            }
            
        } else if (fixingParentheses) {
            fixingParentheses = false

            let answerOfParentheses = expressionArray[0]
            expressionArray = tempArray
            expressionArray.splice(indexOfStartParenthesis, 0, answerOfParentheses)
            console.log(expressionArray)
        } else {

            // makes sure nothing went wrong, and prevents the display from showing "undefined" if nothing is entered before hitting the evaluateButton
            if (expressionArray.length == 1) {

                // the answer is the only number left in the expressionArray
                let answer = expressionArray[0]

                appendHistory(historyExpression, answer); //adds the expression and answer to the history


                expressionArray = [answer]
                // expressionArray = []
                currentNumber = answer
                expression = answer

                if (answer < 0) {
                    answer = Math.abs(answer)
                    answer = ` &minus; ${answer}`
                }
                
                screen.innerHTML = answer



            } else {
                error = "something went wrong with the execution"
                screen.innerHTML = "error"
            } 

            // stops the while-loop
            notSplitted = false
        }

    } // end of while-loop
    
    displayError()
    
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

    if (divisor == 0) {
        error = "Kan ikke dele på null"
        return "undefined"
    } 
        

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

function pow(base, exponent) {

    answer = 1

    for (let i = 0; i < exponent; i++) {

        answer = multiply(answer, base)
        
    }
    
    return answer
}

function square(base) {
    
    return multiply(base, base)

}

function squareRoot(base) {

    if (base < 0) return "error"

    let square = 1
    let i=0

    while(i < 19) {
        i++
        console.log(i)

        // newton's method: (base / square + square) / 2
        square = divide((divide(base, square) + square), 2)
        console.log(square + "    " + i)
    }

    return square;
}

function nthRoot(radicand, root) {
    //https://www.geeksforgeeks.org/calculating-n-th-real-root-using-binary-search/?ref=lbp 

    let low, high; //lower and upper limit of the nth-root of the radicand
    /*if the radicand is in the range [0, 1), the nth-root of the radicand won't be lower than the radicand or higher than 1.
     Example: square root of 0,54 is 0,73 */
    if(0 <= radicand && radicand < 1) {
        low = radicand;
        high = 1;
    }else {
        low = 1;
        high = radicand;
    }

    const accuracy = 0.0001; //The accuracy of the nth root. Example: 0.001 will have an accuracy up to three decimals

    let guess = divide(low + high, 2);

    while (true) {
        let abs_error = Math.abs(pow(guess, root) - radicand);
        if(abs_error > accuracy) {
            if(pow(guess, root) > radicand) {
                
            }
        } else {
            break;
        }
        
    }
}

/**
 * @param {Number} n hola dora
 * @return {String} something special
 * 
 */

function factorial(n) {
// we get the correct starting number for every other n, example: 6! => 1*6 as the first operation, then 6*5 and so on
    let answer = 1

    for (let i = n; i > 0; i--) {

        answer = multiply(answer, i)
    
    }

    return answer
}



function displayError() {
    if (error != "") {
        
        errorContainer.innerHTML = error
        errorContainer.style.display = "flex"
        
        error = ""
    
    } else {
        errorContainer.style.display = "none"
    }
    
}