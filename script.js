// Seleccionamos los elementos clave del DOM
const display = document.getElementById('display')
const expressionDisplay = document.getElementById('expression')
const keys = document.querySelectorAll('[data-action]')

let currentExpression = ''
let currentInput = ''
let lastOperator = ''
let justCalculated = false

//Función para actualizar el display principal
function updateDisplay(value) {
    display.textContent = value || '0'
}

//Función para actualizar la expresión mostrada arriba
function updateExpression(value) {
    expressionDisplay.textContent = value || '\u00A0' // espacio no rompible
}

// Función para realizar el cálculo
function calculate() {
    try {
    const sanitized = currentExpression.replace(/÷/g, '/').replace(/x/g, '*')
    const result = eval(sanitized)
    updateDisplay(result)
    updateExpression(currentExpression + ' =')
    currentExpression = result.toString()
    currentInput = ''
    justCalculated = true;
    }catch (error) {
        updateDisplay('Error')
    }
}

// Función principal de manejo de clicks
function handleClick(e) {
    const key = e.target
    const action = key.dataset.action
    const value = key.dataset.value

    if (!action) return;

    switch(action) {
        case 'number':
            if (justCalculated) {
                currentExpresion = ''
                justCalculated = false
            }
            currentInput += value;
            currentExpression += value
            updateDisplay(currentInput)
            updateExpression(currentExpression)
            break;
        
        case 'operator':
            if (currentExpression ==='' && value !== '-') return
            if (/[+\-*/]$/.test(currentExpression)) {
                currentExpression = currentExpression.slice(0, -1) + value;
            } else {
                currentExpresion += value
            }
            currentInput = ''
            updateExpression(currentExpression)
            break

        case 'decimal':
            if (!currentInput.includes('.')) {
                currentInput += '.'
                currentExpression += '.'
                updateDisplay(currentInput)
                updateExpression(currentExpression)
            }
            break

        case 'percent':
            if (currentInput) {
                currentINput = (parseFloat(currentInput) / 100).toString()
                currentExpression = currentExpression.replace(/(\d`\.?\d*`)$/, currentInput)
                updateDisplay(currentInput)
                updateExpression(currentExpression)
            }
            break

        case 'clear':
            currentExpression = ''
            currentInput = ''
            updateDisplay('0')
            updateExpression('')
            break

        case 'delete':
            if (currentInput) {
                currentInput = currentInput.slice(0, -1)
                currentExpression = currentExpression.slice(0, -1)
                updateDisplay(currentInput || '0')
                updateExpression(currentExpression)
            }
            break

        case 'calculate':
            calculate()
            break
    }
}

// Añadimos listeners a todas lass teclas
keys.forEach(key => key.addEventListener('click', handleClick()))

//Soporte básico de teclado
window.addEventListener('keydown', e => {
    const keu = e.key
    if (/^[0-9]$/.test(key)) {
        document.querySelector(`[data-value="${key}"]`)?.click()
    }else if (['+', '-', '*', '/'].includes(key)) {
        document.querySelector(`[data-value="${key}"]`)?.click();
    } else if (key === 'Enter') {
        document.querySelector('[data-action="calculate"]')?.click();
    } else if (key === 'Backspace') {
        document.querySelector('[data-action="delete"]')?.click();
    } else if (key === 'Escape') {
        document.querySelector('[data-action="clear"]')?.click();
    } else if (key === '%') {
        document.querySelector('[data-action="percent"]')?.click();
    } else if (key === '.') {
        document.querySelector('[data-action="decimal"]')?.click();
    }
});
