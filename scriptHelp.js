import { join } from 'path';
import { existsSync, readdirSync, lstatSync, readFileSync } from 'fs';

function fromDir(startPath, filter, callback) {
  // console.log('Starting from dir '+startPath+'/');

  if (!existsSync(startPath)) {
    console.log('no dir ', startPath);

    return;
  }

  const files = readdirSync(startPath);

  for (let i = 0; i < files.length; i++) {
    const filename = join(startPath, files[i]);
    const stat = lstatSync(filename);

    if (stat.isDirectory()) {
      fromDir(filename, filter, callback); // recurse
    } else if (filter.test(filename)) callback(filename);
  }
}

const executeRegex = fileName => {
  const str = readFileSync(fileName, 'utf-8');
  const matches = /(.+):.*?{.*/.exec(str);
  const fieldMap = matches && matches[0];

  if (fieldMap) {
    console.log('check ', fieldMap);
  }
};

fromDir('./src/forms/definitions', /\.js$/, filename => {
  executeRegex(filename);
});
