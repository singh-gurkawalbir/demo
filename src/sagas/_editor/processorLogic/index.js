// import xmlParser from './xmlParser';
// import csvParser from './csvParser';
// import csvDataGenerator from './csvDataGenerator';
// import transform from './transform';
import handlebars from './handlebars';
// import javascript from './javascript';
// import settingsForm from './settingsForm';
// import structuredFileParser from './structuredFileParser';
// import structuredFileGenerator from './structuredFileGenerator';
// import sql from './sql';
// import filter from './filter';
// import netsuiteLookupFilter from './netsuiteLookupFilter';
// import netsuiteQualificationCriteria from './netsuiteQualificationCriteria';
// import salesforceQualifier from './salesforceQualifier';
// import salesforceLookupFilter from './salesforceLookupFilter';
// import readme from './readme';

const logicMap = {
  handlebars,
};

const init = processor => {
  if (!processor) return;
  const logic = logicMap[processor];

  return logic?.init;
};

/**
 * init is optional for processors and is called during EDITOR_INIT saga.
 * data saved during EDITOR.INIT can be updated with it
 */

export default {
  init,
};
