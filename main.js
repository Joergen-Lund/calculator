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

let chooseExponent = false
let sqrtOfNextNumber = false


numberButtons.forEach(numberButton => {
    numberButton.addEventListener('click', () => inputNumber(numberButton.innerHTML))
})

document.addEventListener("keydown", e => {
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

    // need to choose the exponent before entering more operators
    if (chooseExponent) return

    const sup = document.createElement("sup")
    let values

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
            expression = expressionArray.length > 0 ? expressionArray.join(" ").toString() : "0"
            
            break

        case "(":
            if (allowStartOfParenthesis) {

                if (currentNumber != "" || expressionArray[expressionArray.length - 1] == ")" || expressionArray[expressionArray.length - 1] == "!") {
                    expressionArray.push("×")
                    expression += " × "
                }
                
                expression += ` ${input} `
                
                // console.log(currentNumber)
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

        case "pow":

            if (currentNumber == "") return

            expressionArray.push(input)

            sup.innerHTML = "y"
            sup.classList.add("choose_exponent")

            chooseExponent = true
            
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
            values = ["×", "÷", "+", "−"]
            if (values.includes(expressionArray[expressionArray.length - 1])) return 
            
            input = "×"

            expressionArray.push(input)
            expression += ` × `
    
            break
        
        case "/":
            values = ["×", "÷", "+", "−"]
            if (values.includes(expressionArray[expressionArray.length - 1])) return 

            input = "÷"

            expressionArray.push(input)
            expression += ` ÷ `
    
            break

        case "+":
            values = ["×", "÷", "+", "−"]
            if (values.includes(expressionArray[expressionArray.length - 1])) return 

            expressionArray.push(input)
            expression += ` ${input} `
    

            break

        case "-":
            values = ["×", "÷", "+", "−"]
            if (values.includes(expressionArray[expressionArray.length - 1]) || expressionArray.length == 0) {
                expressionArray.push("(")
                expressionArray.push(0)

                // slightly different symbol
                expressionArray.push("−")
                console.log(expressionArray)

                closeParenthesisAfterNextNumber = true
            } else {
                expressionArray.push("−")
            }
            expression += ` − `
    

            break

        default:
                expressionArray.push(input)
                expression += ` ${input} `
        
 
            break
    }

    currentNumber = ""
    if (input != "Enter") {
        // expression = expression.replace("-", "&minus; ")
        
        expression ? screen.innerHTML = expression : "0"

        if (chooseExponent) {
            screen.appendChild(sup)
        }
        
    }

}

function inputNumber(input) {

    if (expressionArray[expressionArray.length - 1] == ")") {
        expressionArray.push("×")
        expression += " × "
    }

    if (chooseExponent) {
        expression += `<sup>${input}</sup> `
        expressionArray.push(input)
        chooseExponent = false
    } else {
        currentNumber += input
        expression == "0" ? expression = input : expression += input
    }
    
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

    const historyExp = event.target.querySelector("[data-expression]").innerText
    let answer = event.target.querySelector("[data-answer]").innerText
    answer = answer.substring(1, answer.length) // removes the "="-sign from the expression

    if(event.type == "click") { //handles left click

        if(answer < 0) {

            expressionArray.push("(")
            expressionArray.push(0)
            // note: this is not regular minus symbol
            expressionArray.push("−")
            expression += " − "
            console.log(expressionArray)

            closeParenthesisAfterNextNumber = true
        }

        inputNumber(Math.abs(answer))

    } else { //handles right click
        event.preventDefault()

        currentNumber = ""
        expression += historyExp
        expressionArray = expression.split(" ")
        
        // for the evaluate() to work properly, we need to separate "!" from the numbers
        for (let i = 0; i < expressionArray.length; i++) {

            const element = expressionArray[i]

            if (element.includes("!")) {

                console.log("fixing ! in array")
                // insert the number to the same index
                expressionArray[i] = element.replace("!", "")
                // and insert the "!" to the next index
                expressionArray.splice(i + 1, 0, "!")
                
                // because we add the "!" to the array, the next index will contain "!", and the function will insert endless "!". To fix this we increment the counter twice
                i++
            } 
            
        }

        screen.innerHTML = expression

        console.log(expressionArray)
    }
    
}

function clearHistory() {
    historyContainer.innerHTML = ""
}


function evaluate() {

    console.log(expressionArray)

    let historyExpression = expression

    lastExpressionScreen.innerHTML = expression
    lastExpressionScreen.style.visibility = 'visible'

    let notSolved = true
    let fixingParentheses = false
    let tempArray, indexOfStartParenthesis

    while (notSolved) {

        // if the expression includes a value of "infinity", we won't be able to solve the equation. Therefore we set the expressionArray to a single value of "infinity", and the function will go to the else at the end of evaluate() and display the value, and add to history
        if (expressionArray.indexOf("infinity") != -1) {    
            expressionArray = ["infinity"]
        }

        if (expressionArray.indexOf("(") != -1) {
            console.log("parentheses")

            fixingParentheses = true
            indexOfStartParenthesis = expressionArray.indexOf("(")
            let indexOfEndParenthesis = expressionArray.indexOf(")") != -1 ? expressionArray.indexOf(")") : expressionArray.length - 1
            let numberOfItemsToRemove = indexOfEndParenthesis - indexOfStartParenthesis + 1

            
            tempArray = expressionArray
            expressionArray = []
            expressionArray = tempArray.splice(indexOfStartParenthesis, numberOfItemsToRemove)

            // remove the start parenthesis
            expressionArray.shift()

            // if a closing parenthesis is present, remove it
            if (expressionArray.indexOf(")") != -1) expressionArray.pop()
            
            // if the parenthesis were empty, assign 0
            if (expressionArray.length == 0) expressionArray.push(0)

            console.log(expressionArray)
        } else if (expressionArray.indexOf("!") != -1) {

            console.log("factorial")
            let indexOfFactorial = expressionArray.indexOf("!")

            let base = expressionArray[indexOfFactorial - 1]
            base = parseFloat(base)

            expressionArray.splice(indexOfFactorial - 1, 2, factorial(base))
            console.log(expressionArray)
        
        } else if (expressionArray.indexOf("pow") != -1) {

            console.log("pow")
            let indexOfSquare = expressionArray.indexOf("pow")

            let base = expressionArray[indexOfSquare - 1]
            let exponent = expressionArray[indexOfSquare + 1]
            base = parseFloat(base)
            expressionArray.splice(indexOfSquare - 1, 3, pow(base, exponent))
            console.log(expressionArray)

        } else if (expressionArray.indexOf("sqrt") != -1) {
            
            console.log("squareRoot")
            let indexOfSquareRoot = expressionArray.indexOf("sqrt")

            let radicand = expressionArray[indexOfSquareRoot + 1]
            radicand = parseFloat(radicand)
            expressionArray.splice(indexOfSquareRoot, 2, squareRoot(radicand))
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

                let number1 = parseFloat(expressionArray[indexOfMultiplication - 1])
                let number2 = parseFloat(expressionArray[indexOfMultiplication + 1])

                expressionArray.splice(indexOfMultiplication - 1, 3, multiply(number1, number2))
        
                console.log(expressionArray)
            } else {
                console.log("division")
                let number1 = parseFloat(expressionArray[indexOfDivision - 1])
                let number2 = parseFloat(expressionArray[indexOfDivision + 1])

                expressionArray.splice(indexOfDivision - 1, 3, divide(number1, number2))
        
                console.log(expressionArray)
            }
            
    
        } else if (expressionArray.indexOf("+") != -1 || expressionArray.indexOf("−") != -1) {
            
            let indexOfAddition = expressionArray.indexOf("+") != -1 ? expressionArray.indexOf("+") : 1000
            let indexOfSubtraction = expressionArray.indexOf("−") != -1 ? expressionArray.indexOf("−") : 1000

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
                    indexOfSubtraction = expressionArray.indexOf("−")
                } 

                    
                let number1 = expressionArray[indexOfSubtraction - 1]
                number1 = parseFloat(number1)
                
                let number2 = expressionArray[indexOfSubtraction + 1]
                number2 = parseFloat(number2)

                expressionArray.splice(indexOfSubtraction - 1, 3, number1 - number2)

        
                console.log(expressionArray)
            }
            
        } else if (fixingParentheses) {
            console.log("insert answer of parentheses back into array")

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
            notSolved = false
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
        // this is 1/2 regular minus symbols
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
        // this is 1/2 regular minus symbols
        quotient = "-" + quotient
        quotient = parseFloat(quotient)
    }

    return quotient
}

function pow(base, exponent) {

    // if the exponent is 0, the for-loop won't run, and we return the correct answer of 1. Else, it provides a good starting point for calculating the power of the base
    answer = 1

    // to calculate the power of a number, we multiply the number by itself x times
    // example: 5^3 = 5 * 5 * 5
    // using a loop to multiply the number by itself, as many times as the exponent implies
    for (let i = 0; i < exponent; i++) {

        answer = multiply(answer, base)
        
    }
    
    return answer
}

function squareRoot(radicand) {

    if (radicand < 0) return "error"

    let square = 1
    let i=0

    // using newton's method repeatedly to get a very accurate square root of the radicand
    // newton's method: (radicand / square + square) / 2
    for (let i = 0; i < 20; i++) {

        square = divide((divide(radicand, square) + square), 2)
        
    }

    return square;
}



// not completed

// function nthRoot(radicand, root) {
//     //https://www.geeksforgeeks.org/calculating-n-th-real-root-using-binary-search/?ref=lbp 

//     let low, high; //lower and upper limit of the nth-root of the radicand
//     /*if the radicand is in the range [0, 1), the nth-root of the radicand won't be lower than the radicand or higher than 1.
//      Example: square root of 0,54 is 0,73 */
//     if(0 <= radicand && radicand < 1) {
//         low = radicand;
//         high = 1;
//     }else {
//         low = 1;
//         high = radicand;
//     }

//     const accuracy = 0.0001; //The accuracy of the nth root. Example: 0.001 will have an accuracy up to three decimals

//     let guess = divide(low + high, 2);

//     while (true) {
//         let abs_error = Math.abs(pow(guess, root) - radicand);
//         if(abs_error > accuracy) {
//             if(pow(guess, root) > radicand) {
                
//             }
//         } else {
//             break;
//         }
        
//     }
// }



function factorial(n) {

    // if (base < 0 || !Number.isInteger(base)) return

    // 170 is the largest integer for which its factorial can be stored in IEEE 754 double-precision floating-point format (wikipedia: https://en.wikipedia.org/wiki/170_(number)). Therefore we can save some time by just returning "infinity" if the number is larger than 170
    if (n > 170) {
        error = "Kan ikke regne ut fakultet av tall høyere enn 170, på grunn av minne"
        return "infinity"
    }

    // it's convenient the set the initial answer as 1, for two reasons: 
    // 0! = 1 
    // and 
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