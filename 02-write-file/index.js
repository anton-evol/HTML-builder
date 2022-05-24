const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const fullFileName = path.resolve(__dirname, 'output.txt');
const output = fs.createWriteStream(fullFileName);

stdout.write('Привет, проверяющий! Здесь ты можешь написать всё что-угодно. Приступим?\n');
stdin.on('data', (data) => {
  if (data.toString() === 'exit\n') {
    endProcess();
  } else {
    output.write(data);
    stdout.write('Можно писать ещё, смелее!\n');
  }
});
process.on('SIGINT', endProcess);

function endProcess() {
  stdout.write('\nУстал? Отдохни и приходи ещё!\n');
  process.exit();
}
