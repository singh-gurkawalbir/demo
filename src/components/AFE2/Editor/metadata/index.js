import csvParser from './csvParser';
import formBuilder from './formBuilder';
import handlebars from './handlebars';
import sql from './sql';
import filter from './filter';
import javascript from './javascript';

const map = {
  csvParser,
  formBuilder,
  handlebars,
  sql,
  filter,
  javascript,
};
export default map;

export const editorList = Object.keys(map).map(key => map[key]);
