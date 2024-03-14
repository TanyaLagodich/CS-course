const instructions = {
    'SET A': 0,
    'PRINT A': 1,
    'IFN A': 2,
    'RET': 3,
    'DEC A': 4,
    'JMP': 5
};

const program = [
    // Ставим значения аккумулятора в 10
    instructions['SET A'], 20,

    // Выводим значение на экран
    instructions['PRINT A'],

    // Если A равно 0,
    instructions['IFN A'],

    // Программа завершается И возвращает 0
    instructions['RET'], 0,

    // Уменьшаем A на 1
    instructions['DEC A'],

    // Устанавливаем курсор выполняемой инструкции в значение 2
    instructions['JMP'], 2
];

function execute(program) {
    let step = 0;
    let value = 0;

    while (true) {
        switch (program[step]) {
            case instructions['SET A']: {
                value = program[step + 1];
                step += 2;
                break;
            }
            case instructions['PRINT A']: {
                console.log(value);
                step += 1;
                break;
            }
            case instructions['IFN A']: {
                if (value === 0) {
                    step += 1;
                } else {
                    step += 3;
                }
                break;
            }
            case instructions['RET']: {
                return program[step++];
            }
            case instructions['DEC A']: {
                value -= 1;
                step += 1;
                break;
            }
            case instructions['JMP']: {
                step = program[step + 1];
                break;
            }
        }

        if (step > program.length) break;
    }
}

execute(program);
