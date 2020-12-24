import csvParser from './csvParser';
import xmlParser from './xmlParser';
import settingsForm from './settingsForm';
import handlebars from './handlebars';
import sql from './sql';
import filter from './filter';
import javascript from './javascript';
import transform from './transform';
import flowTransform from './flowTransform';
import csvGenerator from './csvGenerator';
import structuredFileGenerator from './structuredFileGenerator';
import structuredFileParser from './structuredFileParser';

const map = {
  csvParser,
  xmlParser,
  settingsForm,
  handlebars,
  sql,
  filter,
  javascript,
  transform,
  flowTransform,
  csvGenerator,
  structuredFileGenerator,
  structuredFileParser,
};
export default map;

export const editorList = Object.keys(map).map(key => map[key]);
