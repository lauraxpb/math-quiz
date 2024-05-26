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
                    inputControl("CHOOSE THE RANKING TYPE:\n1: LEVEL MODE\n2: INFINITE MODE");
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
};

let operators = ["+", "-", "*", "/"];
const LevelUserRankings = {
    easyRanking : {},
    mediumRanking : {},
    hardRanking : {}
};
const InfUserRankings = {};

const rankingsArray = Object.values(LevelUserRankings);

function addPropertyToRanking(index, user, score) {
try{
    rankingsArray[index][user] = score;
    } catch {
        console.log("OUT OF BOUNDS");
    }
}

const MathQuestion = {
    generateOperator: function (ops) {
        return ops[Math.floor(Math.random() * ops.length)];
    },
    generateOperand: function (max) {
        return Math.floor(Math.random() * max + 1);
    },
    fullQuestion: function (numSize) {
        let operand1 = this.generateOperand(numSize);
        let operand2 = this.generateOperand(numSize);
        let operator = this.generateOperator(operators);

        operand1 = operator === "/" ? operand1 * operand2 : operand1;

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

const startInfiniteQuiz = () => {
    let score = 0;
    let difficulty = 1;
    const questionsPerLevel = 10;
    let current = 0;
    while (evaluateQuestion(Math.pow(10, difficulty))) {
        score++;
        current++;
        if (current === questionsPerLevel) {
            difficulty++;
            current = 0;
        }
    }
    console.log(`WRONG! Your score was ${score}`);
    InfUserRankings[customPrompt("Please enter your name here: ")] = score; // RANKING DISTINTO PARA CADA MODO DE JUEGO
    menu();
};

const startLevelQuiz = () => {
    inputControl(
        "Difficulty level:\n1: EASY\n2: MEDIUM\n3: HARD\n4: EXIT",
        4,
        menu
    )
        .then((level) => {
            const gameLength = 30;
            let score = 0;
            while (evaluateQuestion(Math.pow(10, level)) || !gameLength==score){
                score++
            }
            console.log(gameLength==score ? `CONGRATS! YOUR SCORE WAS ${gameLength}` : `WRONG! Your score was ${score}`);
            
            addPropertyToRanking(level,[customPrompt("Please enter your name here: ")],score);
            menu();
        })
        .catch((error) => {
            console.log(error);
            startLevelQuiz();
        });
};

const showRanking = (rankingMode = inputControl("CHOOSE THE RANKING TYPE:\n1: LEVEL MODE\n2: INFINITE MODE")) => {
    let entries = Object.entries(rankingMode);
    let sorted = entries.sort((a, b) => b[1] - a[1]);

    console.log(sorted);
    console.log(sorted.join("\n")); // DISTINTAS LINEAS

    menu();
};

menu();
