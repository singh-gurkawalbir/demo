import DynaMultiSelect from './DynaMultiSelect';
import DynaRadioGroup from './radiogroup/DynaRadioGroup';
import DynaSelect from './DynaSelect';
import DynaLabel from './DynaLabel';
import DynaCeligoTable from './DynaCeligoTable';
import DynaSelectResource from './DynaSelectResource';
import DynaSelectApplication from './DynaSelectApplication';
import DynaFileTypeSelect from './select/DynaFileTypeSelect';
import DynaText from './DynaText';
import DynaCheckbox from './checkbox/DynaCheckbox';
import DynaRelativeUri from './DynaRelativeUri';
import DynaKeyValue from './DynaKeyValue';
import DynaToggleSelectToText from './select/DynaToggleSelectToText';
import DynaLookupEditor from './DynaLookupEditor';
import DynaKeyWithAction from './DynaKeyWithAction';
import DynaHttpRequestBody from './DynaHttpRequestBody';
import DynaEditor from './DynaEditor';
import DynaCsvParse from './editors/DynaCsvParse';
import DynaRefreshableSelect from './DynaRefreshableSelect';
import DynaTransformEditor from './editors/DynaTransformEditor';
import DynaResponseTransformEditor from './editors/DynaResponseTransformEditor';
import DynaTextFtpPort from './DynaTextFtpPort';
import DynaUploadFile from './DynaUploadFile';
import DynaHook from './DynaHook';
import DynaSuiteScriptHook from './DynaSuiteScriptHook';
import DynaScriptContent from './DynaScriptContent';
import DynaSelectScopes from './DynaSelectScopes';
import DynaFileDefinitionSelect from './DynaFileDefinitionSelect';
import DynaFileDefinitionEditor from './editors/DynaFileDefinitionEditor';
import DynaCSVColumnMapper from './DynaTableView/DynaCSVColumnMapper';
import DynaTrueFixedWidthColumnMapper from './DynaTableView/DynaTrueFixedWidthColumnMapper';
import DynaXMLMapper from './DynaTableView/DynaXMLMapper';
import DynaTokenGenerator from './DynaTokenGenerator';
import DynaApiIdentifier from './DynaApiIdentifier';
import DynaStaticMap from './DynaTableView';
import DynaNetsuiteUserRolesOptions from './DynaNetsuiteUserRoles';
import DynaNSSavedSearch from './DynaNSSavedSearch';
import DynaAssistantOptions from './assistant/DynaAssistantOptions';
import DynaAssistantSearchParams from './assistant/DynaAssistantSearchParams';
import DynaLabelValueElement from './DynaLabelValueElement';
import DynaRawData from './DynaRawData';
import DynaSampleData from './DynaSampleData';
import DynaXmlParse from './editors/DynaXmlParse';
import DynaImportMapping from './DynaImportMapping';
import DynaFieldExpressionSelect from './DynaFieldExpressionSelect';
import DynaAutoSuggest from './DynaAutoSuggest';
import DynaGenerateUrl from './DynaGenerateUrl';
import DynaWebhookTokenGenerator from './DynaWebhookTokenGenerator';
import DynaSelectForSetFields from './select/DynaSelectForSetFields';
import DynaTextForSetFields from './text/DynaTextForSetFields';
import DynaSoqlQuery from './DynaSoqlQuery';
import DynaSalesforceRefreshableSelect from './DynaSalesforceRefreshableSelect';
import DynaRefreshableIntegrationAppSetting from './DynaRefreshableSelect/RefreshableIntegrationAppSetting';
import DynaDate from './dateTime/DynaDate';
import DynaDateTime from './dateTime/DynaDateTime';
import DynaToggle from './DynaToggle';
import DynaSQLQueryBuilder from './DynaSQLQueryBuilder';
import DynaTextWithLookupExtract from './DynaTextWithLookupExtract';
import Salesforce from './DynaSalesforceExportComponents';
import { ReferencedFieldsModal } from './DynaSalesforceExportComponents/DynaTreeModal';
import DynaNetSuiteLookupFilters from './DynaNetSuiteLookupFilters';
import DynaNetSuiteLookup from './DynaNetSuiteLookup';
import DynaIAExpression from './DynaIAExpression';
import DynaUserEmail from './DynaUserEmail';
import DynaUserPassword from './DynaUserPassword';
import DynaIclient from './DynaIclient';
import DynaNetSuiteQualifier from './DynaNetSuiteQualifier';
import DynaSalesforceQualifier from './DynaSalesforceQualifier';
import DynaQuery from './DynaQuery';
import DynaSalesforceLookupFilters from './DynaSalesforceLookupFilters';
import DynaSalesforceLookup from './DynaSalesforceLookup';
import DynaMultiSubsidiaryMapping from './DynaTableView/DynaMultiSubsidiaryMapping';
import DynaTimestampFileName from './DynaTimestampFileName';
import DynaMode from './DynaMode';
import DynaAutoSuggestFlowSampleData from './DynaAutoSuggestFlowSampleData';
import DynaCsvGenerate from './editors/DynaCsvGenerate';
import DynaFileKeyColumn from './DynaFileKeyColumn';
import DynaRadioGroupForResetFields from './radiogroup/DynaRadioGroupForResetFields';
import DynaTextWithFlowContext from './text/DynaTextWithFlowContext';
import DynaCheckboxForResetFields from './checkbox/DynaCheckboxForResetFields';
import DynaExportPanel from './DynaExportPanel';

export default {
  mode: DynaMode,
  mapping: DynaImportMapping,
  toggleSelectToText: DynaToggleSelectToText,
  selectscopes: DynaSelectScopes,
  text: DynaText,
  editor: DynaEditor,
  textarea: DynaText,
  checkbox: DynaCheckbox,
  select: DynaSelect,
  xmlMapper: DynaXMLMapper,
  trueFixedWidthColumnMapper: DynaTrueFixedWidthColumnMapper,
  csvColumnMapper: DynaCSVColumnMapper,
  subsidiaryMapWidget: DynaMultiSubsidiaryMapping,
  selectresource: DynaSelectResource,
  selectapplication: DynaSelectApplication,
  filetypeselect: DynaFileTypeSelect,
  multiselect: DynaMultiSelect,
  radiogroup: DynaRadioGroup,
  relativeuri: DynaRelativeUri,
  httprequestbody: DynaHttpRequestBody,
  importLookup: DynaLookupEditor,
  keyvalue: DynaKeyValue,
  staticMap: DynaStaticMap,
  staticMapWidget: DynaStaticMap,
  csvparse: DynaCsvParse,
  csvgenerate: DynaCsvGenerate,
  xmlparse: DynaXmlParse,
  refreshableselect: DynaRefreshableSelect,
  transformeditor: DynaTransformEditor,
  responsetransformeditor: DynaResponseTransformEditor,
  ftpport: DynaTextFtpPort,
  uploadfile: DynaUploadFile,
  labeltitle: DynaLabel,
  celigotable: DynaCeligoTable,
  hook: DynaHook,
  suitescripthook: DynaSuiteScriptHook,
  scriptcontent: DynaScriptContent,
  filedefinitionselect: DynaFileDefinitionSelect,
  filedefinitioneditor: DynaFileDefinitionEditor,
  tokengen: DynaTokenGenerator,
  apiidentifier: DynaApiIdentifier,
  labelvalue: DynaLabelValueElement,
  netsuiteuserroles: DynaNetsuiteUserRolesOptions,
  nssavedsearch: DynaNSSavedSearch,
  rawdata: DynaRawData,
  sampledata: DynaSampleData,
  assistantoptions: DynaAssistantOptions,
  assistantsearchparams: DynaAssistantSearchParams,
  keywithaction: DynaKeyWithAction,
  fieldexpressionselect: DynaFieldExpressionSelect,
  autosuggest: DynaAutoSuggest,
  generateurl: DynaGenerateUrl,
  webhooktokengenerator: DynaWebhookTokenGenerator,
  selectforsetfields: DynaSelectForSetFields,
  textforsetfields: DynaTextForSetFields,
  toggle: DynaToggle,
  soqlquery: DynaSoqlQuery,
  salesforcerefreshableselect: DynaSalesforceRefreshableSelect,
  integrationapprefreshableselect: DynaRefreshableIntegrationAppSetting,
  date: DynaDate,
  datetime: DynaDateTime,
  sqlquerybuilder: DynaSQLQueryBuilder,
  salesforcequalifier: DynaSalesforceQualifier,
  textwithlookupextract: DynaTextWithLookupExtract,
  salesforcerequiredtrigger: Salesforce.DynaRequiredTrigger,
  salesforcereferencedfields: Salesforce.DynaReferencedFields,
  salesforcerelatedlistmodal: ReferencedFieldsModal,
  salesforcerelatedlist: Salesforce.DynaRelatedList,
  salesforcetreemodal: Salesforce.DynaTreeModal,
  salesforcereferencedfieldsia:
    Salesforce.IASettingsComponents.DynaReferencedFieldsIA,
  salesforcerelatedlistia: Salesforce.IASettingsComponents.DynaRelatedListIA,
  netsuitelookupfilters: DynaNetSuiteLookupFilters,
  netsuitelookup: DynaNetSuiteLookup,
  iaexpression: DynaIAExpression,
  useremail: DynaUserEmail,
  userpassword: DynaUserPassword,
  dynaiclient: DynaIclient,
  netsuitequalifier: DynaNetSuiteQualifier,
  query: DynaQuery,
  salesforcelookupfilters: DynaSalesforceLookupFilters,
  salesforcelookup: DynaSalesforceLookup,
  timestampfilename: DynaTimestampFileName,
  autosuggestflowsampledata: DynaAutoSuggestFlowSampleData,
  filekeycolumn: DynaFileKeyColumn,
  radiogroupforresetfields: DynaRadioGroupForResetFields,
  textwithflowcontext: DynaTextWithFlowContext,
  checkboxforresetfields: DynaCheckboxForResetFields,
  exportpanel: DynaExportPanel,
};
