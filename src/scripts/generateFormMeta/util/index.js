import fs from 'fs';
// import readline from 'readline';

export default filename => {
  const contents = fs.readFileSync(filename);

  return JSON.parse(contents.toString());
};

// export const consoleReadInterface = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   terminal: false,
// });
