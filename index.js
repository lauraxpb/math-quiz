import promptSync from "prompt-sync";
const prompt = promptSync();

const customPrompt = (inputText) => {
    console.log(inputText);
    return prompt();
};

const inputControl = (readableString, exitOption, prev) => {
    return new Promise((resolve, reject) => {
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
                    break;
                case 4:
                    process.exit(0);
            }
        })
        .catch((error) => {
            console.log(error);
            menu();
        });
}; // TODO IF YOU PRESS ENTER IT COUNTS AS AN INCORRECT ANSWER

let operators = ["+", "-", "*", "/"];

const Rankings = {
    easyRanking: {},
    mediumRanking: {},
    hardRanking: {},
    infiniteRanking: {},
};
const rankingsArray = Object.keys(Rankings);

function multipleOf(a, b) {
    function gcf(a, b) {
        return b == 0 ? a : gcf(b, a % b);
    }
    return gcf(a, b);
}

const MathQuestion = {
    generateOperator: function (ops) {
        return ops[Math.floor(Math.random() * ops.length)];
    },
    generateOperand: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    fullQuestion: function (numSize) {
        let operand1 = this.generateOperand(0, numSize);
        let operand2 = this.generateOperand(1, numSize + 1); // Ensure operand2 is never 0 by setting min to 1
        let operator = this.generateOperator(operators);

        while (operand1 % operand2 !== 0 && operator === "/") {
            operand1 = this.generateOperand(1, numSize + 1);
        }

        return `${operand1} ${operator} ${operand2}`;
    },
};

const evaluateQuestion = (difficulty) => {
    let answer, questionObj, question, result;
    questionObj = Object.create(MathQuestion);
    question = questionObj.fullQuestion(difficulty);
    do {
        answer = customPrompt(question);
    } while (isNaN(answer));
    result = eval(question) === parseInt(answer);
    return result;
};


const wantsTimeout = (opt = inputControl("Do you want to add a timer?\n1: YES\n2: NO\n 3: GO BACK")) => {
    let tOut = opt = 1 ? questionTimeout : evaluateQuestion;
}

/*
function withTimeout(promise, timeout) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('Operation timed out'));
        }, timeout);

        promise.then(
            (value) => {
                clearTimeout(timer);
                resolve(evaluateQuestion);
            },
            (error) => {
                clearTimeout(timer);
                reject(error);
            }
        );
    });
}

const questionTimeout = new Promise((resolve) => {
    setTimeout(() => {
        resolve('Completed!');
    }, 1000); 
});

withTimeout(wantsTimeout, 4000) 
    .then((result) => {
        console.log(result); // "Completed!"
    })
    .catch((error) => {
        console.error(error.message); 
    });
*/

const startLevelQuiz = () => {
    inputControl(
        "Difficulty level:\n1: EASY\n2: MEDIUM\n3: HARD\n4: EXIT",
        4,
        menu
    )
        .then((level) => {
            const gameLength = 30;
            let score = 0;
            while (
                evaluateQuestion(Math.pow(10, level)) &&
                gameLength > score
            ) {
                score++;
            }
            console.log(
                gameLength == score
                    ? `CONGRATS! YOUR SCORE WAS ${gameLength}`
                    : `WRONG! Your score was ${score}`
            );
            addPropertyToRanking(
                level - 1,
                [customPrompt("Please enter your name here: ")],
                score
            );
            menu();
        })
        .catch((error) => {
            console.log(error);
            startLevelQuiz();
        });
};

const startInfiniteQuiz = () => {
    let score = 0;
    let difficulty = 1;
    const questionsPerLevel = 10;
    let current = 1;
    while (evaluateQuestion(Math.pow(10, difficulty))) {
        score++;
        current++;
        if (current === questionsPerLevel) {
            difficulty++;
            current = 1;
        }
    }
    console.log(`WRONG! Your score was ${score}`);
    addPropertyToRanking(
        3,
        customPrompt("Please enter your name here: "),
        score
    );
    menu();
};

const showRanking = () => {
    inputControl(
        "CHOOSE THE RANKING TYPE:\n1: EASY\n2: MEDIUM\n3: HARD\n4: INFINTE"
    )
        .then((rankingMode) => {
            displayResult(Rankings[rankingsArray[rankingMode - 1]]);
            menu();
        })
        .catch((error) => {
            console.log(error);
        });
};

const addPropertyToRanking = (index, user, score) => {
    try {
        Rankings[rankingsArray[index]][user] = score;
    } catch {
        console.log("OUT OF BOUNDS");
    }
};

const sortedRanking = (ranking) => {
    return Object.entries(ranking).sort((a, b) => b[1] - a[1]);
};

const displayResult = (ranking) => {
    let sorted = sortedRanking(ranking);
    sorted.forEach(([user, score]) => {
        console.log(`-${user}: ${score}`);
    });
};

menu();
