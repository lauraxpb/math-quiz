import promptSync from "prompt-sync";
const prompt = promptSync();

const customPrompt = (inputText) => {
    console.log(inputText);
    return prompt();
};



// Your code goes here
const menu = () => {
    switch (customPrompt("1: Start the quiz\n2: Infinite Mode\n3: Exit:")) {
        case "1":
            startLevelQuiz();
            break;
        case "2":
            startInfiniteQuiz();
            break;
        case "3":
            process.exit(0);
        default:
            console.log("Invalid input. Please try again.");
            menu();
            break;
    }
};

let operators = ["+", "-", "*", "/"];

const MathQuestion = {
    generateOperator: function (ops) {
        return ops[Math.floor(Math.random() * ops.length)];
    },
    generateOperand: function (max) {
        return Math.floor(Math.random() * max);
    },
    fullQuestion: function (numSize) {
        return `${this.generateOperand(numSize)}${this.generateOperator(
            operators
        )}${this.generateOperand(numSize)}`;
    },
};

// TODO parchear divisiones entre 0, numeros decimales e introducir letras

const makeQuiz = (difficulty) => {
    let questionObj = Object.create(MathQuestion);
    let question = questionObj.fullQuestion(difficulty);

    while (eval(question) === parseInt(customPrompt(question))) {
        question = questionObj.fullQuestion(difficulty);
    }
    console.log("WRONG!");
    menu();
};

const startLevelQuiz = () => {
    makeQuiz(Math.pow(10,customPrompt("Difficulty level:\n1: EASY\n 2: MEDIUM \n 3: HARD")))
}






menu();