import DynaMultiSelect from './DynaMultiSelect';
import DynaRadioGroup from './DynaRadioGroup';
import DynaSelect from './DynaSelect';
import DynaLabel from './DynaLabel';
import DynaSelectResource from './DynaSelectResource';
import DynaSelectApplication from './DynaSelectApplication';
import DynaText from './DynaText';
import DynaCheckbox from './DynaCheckbox';
import DynaRelativeUri from './DynaRelativeUri';
import DynaKeyValue from './DynaKeyValue';
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
import DynaSoqlQuery from './DynaSoqlQuery';
import DynaSalesforceRefreshableSelect from './DynaSalesforceRefreshableSelect';
import DynaSQLQueryBuilder from './DynaSQLQueryBuilder';
import DynaRelativeURIWithLookup from './DynaRelativeURIWithLookup';

export default {
  mapping: DynaImportMapping,
  selectscopes: DynaSelectScopes,
  text: DynaText,
  editor: DynaEditor,
  textarea: DynaText,
  checkbox: DynaCheckbox,
  select: DynaSelect,
  subsidiaryMapWidget: DynaStaticMap,
  xmlMapper: DynaXMLMapper,
  trueFixedWidthColumnMapper: DynaTrueFixedWidthColumnMapper,
  csvColumnMapper: DynaCSVColumnMapper,
  selectresource: DynaSelectResource,
  selectapplication: DynaSelectApplication,
  multiselect: DynaMultiSelect,
  radiogroup: DynaRadioGroup,
  relativeuri: DynaRelativeUri,
  httprequestbody: DynaHttpRequestBody,
  importLookup: DynaLookupEditor,
  keyvalue: DynaKeyValue,
  staticMap: DynaStaticMap,
  staticMapWidget: DynaStaticMap,
  csvparse: DynaCsvParse,
  xmlparse: DynaXmlParse,
  refreshableselect: DynaRefreshableSelect,
  transformeditor: DynaTransformEditor,
  responsetransformeditor: DynaResponseTransformEditor,
  ftpport: DynaTextFtpPort,
  uploadfile: DynaUploadFile,
  labeltitle: DynaLabel,
  hook: DynaHook,
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
  soqlquery: DynaSoqlQuery,
  salesforcerefreshableselect: DynaSalesforceRefreshableSelect,
  sqlquerybuilder: DynaSQLQueryBuilder,
  relativeuriwithlookup: DynaRelativeURIWithLookup,
};
