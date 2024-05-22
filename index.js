import promptSync from "prompt-sync";
const prompt = promptSync();

const customPrompt = (inputText) => {
    console.log(inputText);
    return prompt();
};

const inputControl = (readableString, exitOption, prev) => {
    return new Promise((resolve, reject) => {
        //console.log(readableString);
        let choice = Number(customPrompt(readableString));
        var options = readableString.match(/\d+/g).map(Number);
        
        if (choice === exitOption) {
            console.log("Exiting...");
            prev();
            return;
        }
        if (!options.includes(choice)) {
            reject("Invalid input. Try again.");
        }
        resolve(choice);
    });
};

/*
const string = "b12345hola";
const [match] = string.match(/(\d+)/);
match; // 12345
*/

const menu = () => {
    inputControl(
        "WELCOME TO MATH QUIZ\n1: START THE QUIZ: LEVEL MODE\n2: START THE QUIZ: INFINITE MODE\n3: EXIT"
    )
        .then((choice) => {
            switch (choice) {
                case 1:
                    startLevelQuiz();
                    break;
                case 2:
                    startInfiniteQuiz();
                    break;
                case "3":
                    process.exit(0);
            }
        })
        .catch((error) => {
            console.log(error);
            menu();
        });
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

// TODO parchear divisiones entre 0 y numeros decimales 

const makeQuiz = (difficulty) => {
    let questionObj = Object.create(MathQuestion);
    let question = questionObj.fullQuestion(difficulty);

    try {
        while (eval(question) === parseInt(customPrompt(question))) {
            question = questionObj.fullQuestion(difficulty);
        }
    } catch {}
    console.log("WRONG!");
    menu();
};

const startLevelQuiz = () => {
    inputControl("Difficulty level:\n1: EASY\n2: MEDIUM\n3: HARD\n4:EXIT",4,menu)
        .then((level) => {
            makeQuiz(Math.pow(10, level));
        })
        .catch((error) => {
            console.log(error);
            startLevelQuiz();
        });
};

menu();
