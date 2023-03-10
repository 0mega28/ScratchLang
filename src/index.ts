import fs = require('fs');
import readLine = require('readline');
import Scanner from './lexer';
import Parser from './parser';
import AstPrinter from './utils/astprinter';

if (process.argv.length > 3) {
  console.log('Usage:', process.argv[1], '<filename>');
} else if (process.argv.length === 3) {
  runFile(process.argv[2])
    .then(() => console.log('File run successfully'))
    .catch(err => console.error(err));
} else {
  runPrompt()
    .then(() => console.log('execution done'))
    .catch(err => console.error(err));
}

function runFile(fileName: string) {
  return new Promise<void>((resolve, reject) => {
    let buffer: unknown;
    try {
      buffer = fs.readFileSync(fileName);
    } catch (error: unknown) {
      reject((error as Error).message);
      return;
    }

    const source: string = (buffer as Buffer).toString().trim();
    run(source).then(resolve).catch(reject);
  });
}

function runPrompt() {
  return new Promise<void>((resolve, reject) => {
    const rl = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    (async () => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const line: string = await new Promise<string>(resolve =>
          rl.question('> ', resolve)
        );

        if (line === '') break;

        try {
          await run(line);
        } catch (error) {
          console.error(error);
          // ignore error and continue REPL
        }
      }

      resolve();
      rl.close();
    })();
  });
}

function run(source: string) {
  return new Promise<void>((resolve, reject) => {
    Promise.resolve()
      .then(() => new Scanner(source).scanTokens())
      .then(tokens => new Parser(tokens).parse())
      .then(expr => new AstPrinter().print(expr))
      .then(console.log)
      .then(resolve)
      .catch(reject);
  });
}
