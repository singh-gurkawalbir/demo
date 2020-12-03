import csvParser from './csvParser';
import settingsForm from './settingsForm';
import handlebars from './handlebars';
import sql from './sql';
import filter from './filter';
import javascript from './javascript';

const map = {
  csvParser,
  settingsForm,
  handlebars,
  sql,
  filter,
  javascript,
};
export default map;

export const editorList = Object.keys(map).map(key => map[key]);
