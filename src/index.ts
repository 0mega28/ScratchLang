import fs = require('fs');
import readLine = require('readline');

if (process.argv.length > 3) {
  console.log('Usage:', process.argv[1], '<filename>');
} else if (process.argv.length === 3) {
  runFile(process.argv[2]).catch(err => console.error(err));
} else {
  runPrompt().catch(err => console.error(err));
}

function runFile(fileName: string) {
  return new Promise<void>((resolve, reject) => {
    let buffer: unknown;
    try {
      buffer = fs.readFileSync(fileName);
    } catch (error: unknown) {
      reject((error as Error).message);
    }

    const source: string = (buffer as Buffer).toString();
    run(source).catch(err => reject(err));
    resolve();
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

        run(line).catch(err => reject(err));
      }
    })();

    resolve();
  });
}

function run(source: string) {
  return new Promise<void>((resolve, reject) => {
    const tokens: string[] = source.split(/\s+/);
    tokens.forEach(token => {
      console.log(token);
    });
    resolve();
  });
}
