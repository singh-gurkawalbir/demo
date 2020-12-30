import csvParser from './csvParser';
import xmlParser from './xmlParser';
import settingsForm from './settingsForm';
import handlebars from './handlebars';
import sql from './sql';
import filter from './filter';
import javascript from './javascript';
import transform from './transform';
import flowTransform from './flowTransform';
import exportFilter from './exportFilter';
import inputFilter from './inputFilter';
import outputFilter from './outputFilter';
import csvGenerator from './csvGenerator';
import structuredFileGenerator from './structuredFileGenerator';
import structuredFileParser from './structuredFileParser';
import postResponseMapHook from './postResponseMapHook';
import responseTransform from './responseTransform';

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
  exportFilter,
  inputFilter,
  outputFilter,
  csvGenerator,
  structuredFileGenerator,
  structuredFileParser,
  postResponseMapHook,
  responseTransform,
};
export default map;

export const editorList = Object.keys(map).map(key => map[key]);
