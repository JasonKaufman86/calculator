

// ---------------------------------------------------
// Audio
// ---------------------------------------------------

function playClickSound() {
    const click = new Audio('./assets/click.mp3')
    click.volume = 0.2;
    click.play();
}

// ---------------------------------------------------
// Calculator
// ---------------------------------------------------

const DIVIDE_BY_ZERO_ERROR = new Error("Cannot divide by zero");
const INVALID_OPERATOR_ERROR = new Error("Invalid operator");


function add(operandA, operandB){
    return operandA + operandB;
}

function sub(operandA, operandB){
    return operandA - operandB;
}

function mul(operandA, operandB){
    return operandA * operandB;
}

function div(operandA, operandB){
    if (!operandB) throw DIVIDE_BY_ZERO_ERROR;
    return operandA / operandB;
}

const OPERATIONS = {'+': add, '-': sub, '*': mul, "/": div};

function calculate(operandA, operandB, operator){
    if (!(operator in OPERATIONS)) throw INVALID_OPERATOR_ERROR;
    func = OPERATIONS[operator];
    return func(operandA, operandB);
}

// ---------------------------------------------------
// Display
// ---------------------------------------------------

const DISPLAY_MAX_CONTENT_LENGTH = 10;

let display = document.querySelector('#display');

function canDisplayContent(content) {
    return content.length <= DISPLAY_MAX_CONTENT_LENGTH;
}

function setDisplayContent(content) {
    display.innerText = content;
}

function delDisplayContent() {
    setDisplayContent('');
}

function getDisplayContent() {
    return display.innerText;
}

function hasDisplayAnyContent() {
    let current = getDisplayContent();
    return current != '';
}

function hasDisplayCharInContent(char) {
    return getDisplayContent().includes('.')
}

function canAddCharToContent() {
    let current = getDisplayContent();
    return current.length < DISPLAY_MAX_CONTENT_LENGTH;
}

function addCharToDisplay(content) {
    let current = getDisplayContent();
    setDisplayContent(current + content);
}

function delLastCharFromDisplay(){
    let current = getDisplayContent();
    setDisplayContent(current.slice(0, -1))
}

function setDisplayColor(color) {
    display.style.backgroundColor = color;
}

// ---------------------------------------------------
// Buttons
// ---------------------------------------------------

const buttons = document.querySelectorAll('button')

buttons.forEach(b => {
    b.addEventListener('click', (e) => {
        handleInput(e.target.innerText);
    })
});

function disableButtons() {
    buttons.forEach(b => {b.disabled = true;});
}

function enableButtons() {
    buttons.forEach(b => {b.disabled = false;});
}

// ---------------------------------------------------
// Keyboard
// ---------------------------------------------------

const KEYS = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '+', '-', '/', '*', '=', '.',
    'Backspace', 'Delete', 'Enter'
];

window.addEventListener('keydown', (e) => {
    if (!(KEYS.includes(e.key))) return;
    handleInput(e.key)
})

// ---------------------------------------------------
// State
// ---------------------------------------------------

let memory = null;
let operator = null;

// ---------------------------------------------------
// Inputs
// ---------------------------------------------------

function handleClearInput() {
    delDisplayContent();
    memory = null;
    operator = null;
}

function handleDeleteInput() {
    delLastCharFromDisplay();
}

function handleDotInput() {

    if (!hasDisplayAnyContent()) 
        return setDisplayContent('0.');

    if (hasDisplayCharInContent('.')) 
        return;

    addCharToDisplay('.')
}

function handleNumberInput(input) {
    if (getDisplayContent() == '0'){
        let input = input == 0 ? 0 : input; 
        return setDisplayContent(input);
    }
    addCharToDisplay(input);
}

function handleOperatorInput(input) {
    if (!hasDisplayAnyContent()) return;
    if (memory) return handleEqualsInput();
    let current = +getDisplayContent()
    delDisplayContent();
    if (current != memory)
        memory = memory === null ? current: memory + current;
    operator = input;
}

function handleEqualsInput() {
    if (memory === null || operator === null) 
        return;

    try {
        operand = +getDisplayContent();
        value = calculate(memory, operand, operator);
    } 
    catch (DIVIDE_BY_ZERO_ERROR) {
        return setDisplayContent('8008135');
    }

    if (!canDisplayContent(''+value)){
        return setDisplayContent(value.toExponential(3));
    }

    setDisplayContent(value);
    memory = null;
    operator = null;
}

function handleInput(input) {

    playClickSound()

    if (['AC','Delete'].includes(input)) 
        return handleClearInput();
    
    if (['DEL','Backspace'].includes(input)) 
        return handleDeleteInput();
    
    if (['+', '-', '/', '*'].includes(input))
        handleOperatorInput(input);
    
    if (['Enter', '='].includes(input)) 
        return handleEqualsInput();

    if (!canAddCharToContent())
        return;

    if (input == '.') 
        return handleDotInput(input);
    
    if (+input === +input)
        return handleNumberInput(+input)

}
