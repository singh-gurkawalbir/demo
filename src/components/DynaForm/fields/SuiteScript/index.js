/* eslint-disable camelcase */
import DynaApiMethod from './DynaApiMethod';
import DynaCsvParse_afe2 from './editors/DynaCsvParse_afe2';
import DynaNetSuiteFolderPath from './DynaNetSuiteFolderPath';
import DynaSoqlQuery from './DynaSoqlQuery';
import DynaSalesforceRefreshableSelect from './DynaSalesforceRefreshableSelect';
import DynaApiParameters from './DynaApiParameters';
import DynaNetSuiteUpsertField from './DynaNetSuiteUpsertField';
import DynaNetSuiteLookup from './DynaNetSuiteLookup';
import DynaFileKeyColumn_afe2 from './DynaFileKeyColumn_afe2';
import DynaSalesforceLookupFilters from './DynaSalesforceLookupFilters';
import DynaRefreshableSelect from './DynaRefreshableSelect';
import DynaNetSuiteSubRecords from './DynaNetSuiteSubRecords';

export default {
  suitescriptapimethod: DynaApiMethod,
  // suitescriptcsvparse: DynaCsvParse,
  suitescriptcsvparse: DynaCsvParse_afe2,
  suitescriptnetsuitefolderpath: DynaNetSuiteFolderPath,
  suitescriptsoqlquery: DynaSoqlQuery,
  suitescriptsalesforcerefreshableselect: DynaSalesforceRefreshableSelect,
  suitescriptapiparameters: DynaApiParameters,
  suitescriptnetsuiteupsertfield: DynaNetSuiteUpsertField,
  suitescriptnetsuitelookup: DynaNetSuiteLookup,
  // suitescriptfilekeycolumn: DynaFileKeyColumn,
  suitescriptfilekeycolumn: DynaFileKeyColumn_afe2,
  suitescriptsalesforcelookupfilters: DynaSalesforceLookupFilters,
  suitescriptrefreshableselect: DynaRefreshableSelect,
  suitescriptnetsuitesubrecords: DynaNetSuiteSubRecords,
};
