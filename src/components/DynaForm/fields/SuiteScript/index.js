/* eslint-disable camelcase */
import DynaApiMethod from './DynaApiMethod';
import DynaCsvParse_afe2 from './editors/DynaCsvParse_afe2';
import DynaNetSuiteFolderPath from './DynaNetSuiteFolderPath';
import DynaSoqlQuery from './DynaSoqlQuery';
import DynaSalesforceRefreshableSelect from './DynaSalesforceRefreshableSelect';
import DynaApiParameters from './DynaApiParameters';
import DynaNetSuiteUpsertField from './DynaNetSuiteUpsertField';
import DynaNetSuiteLookup_afe2 from './DynaNetSuiteLookup_afe2';
import DynaFileKeyColumn_afe2 from './DynaFileKeyColumn_afe2';
import DynaSalesforceLookupFilters_afe2 from './DynaSalesforceLookupFilters_afe2';
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
  // suitescriptnetsuitelookup: DynaNetSuiteLookup,
  suitescriptnetsuitelookup: DynaNetSuiteLookup_afe2,
  // suitescriptfilekeycolumn: DynaFileKeyColumn,
  suitescriptfilekeycolumn: DynaFileKeyColumn_afe2,
  // suitescriptsalesforcelookupfilters: DynaSalesforceLookupFilters,
  suitescriptsalesforcelookupfilters: DynaSalesforceLookupFilters_afe2,
  suitescriptrefreshableselect: DynaRefreshableSelect,
  suitescriptnetsuitesubrecords: DynaNetSuiteSubRecords,
};
