import DynaApiMethod from './DynaApiMethod';
import DynaCsvParse from './editors/DynaCsvParse';
import DynaNetSuiteFolderPath from './DynaNetSuiteFolderPath';
import DynaSoqlQuery from './DynaSoqlQuery';
import DynaSalesforceRefreshableSelect from './DynaSalesforceRefreshableSelect';
import DynaApiParameters from './DynaApiParameters';
import DynaNetSuiteUpsertField from './DynaNetSuiteUpsertField';
import DynaNetSuiteLookup from './DynaNetSuiteLookup';
import DynaFileKeyColumn from './DynaFileKeyColumn';

export default {
  suitescriptapimethod: DynaApiMethod,
  suitescriptcsvparse: DynaCsvParse,
  suitescriptnetsuitefolderpath: DynaNetSuiteFolderPath,
  suitescriptsoqlquery: DynaSoqlQuery,
  suitescriptsalesforcerefreshableselect: DynaSalesforceRefreshableSelect,
  suitescriptapiparameters: DynaApiParameters,
  suitescriptnetsuiteupsertfield: DynaNetSuiteUpsertField,
  suitescriptnetsuitelookup: DynaNetSuiteLookup,
  suitescriptfilekeycolumn: DynaFileKeyColumn,
};
