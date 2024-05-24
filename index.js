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


const menu = () => {
    inputControl(
        "WELCOME TO MATH QUIZ\n1: START THE QUIZ: LEVEL MODE\n2: START THE QUIZ: INFINITE MODE\n3: SHOW RANKINGS\n4: EXIT"
    )
        .then((choice) => {
            switch (choice) {
                case 1:
                    startLevelQuiz();
                    break;
                case 2:
                    startInfiniteQuiz();
                    break;
                case 3:
                    showRanking();
                    break
                case 4:
                    process.exit(0);
            }
        })
        .catch((error) => {
            console.log(error);
            menu();
        });
};

let operators = ["+", "-", "*", "/"];
const UserRankings = {}

const MathQuestion = {
    generateOperator: function (ops) {
        return ops[Math.floor(Math.random() * ops.length)];
    },
    generateOperand: function (max) {
        return Math.floor(Math.random() * max +1);
    },
    fullQuestion: function (numSize) {
        let operand1 = this.generateOperand(numSize);
        let operand2 = this.generateOperand(numSize);
        let operator = this.generateOperator(operators);

        operand1 = operator === "/" ? operand1 * operand2 : operand1;

        return `${operand1} ${operator} ${operand2}`;
    },
};

const makeQuiz = (difficulty) => {
    let answer, questionObj, question;
    let score = 0;
    do {
        questionObj = Object.create(MathQuestion);
        question = questionObj.fullQuestion(difficulty);
        answer = customPrompt(question);
        if (isNaN(answer)) {
            console.log("Enter a number");
            continue;
        }
        score++;
    } while (eval(question) === parseInt(answer))
    console.log(`WRONG! Your score was ${score}`);
    UserRankings[customPrompt('Please enter your name here: ')] = score;  // RANKING DISTINTO PARA CADA MODO DE JUEGO
    menu();
};

const startLevelQuiz = () => {
    inputControl(
        "Difficulty level:\n1: EASY\n2: MEDIUM\n3: HARD\n4:EXIT",
        4,
        menu
    )
        .then((level) => {
            makeQuiz(Math.pow(10, level));
        })
        .catch((error) => {
            console.log(error);
            startLevelQuiz();
        });
};

const startInfiniteQuiz = () => {
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 6; j++) {
            makeQuiz(Math.pow(10, i));
        }
    }
};

const showRanking = () => {
    let entries = Object.entries(UserRankings);
    let sorted = entries.sort((a, b) => b[1] - a[1]);

    console.log(sorted);
    console.log(sorted.join("\n")); // DISTINTAS LINEAS

    menu();
}

menu();
