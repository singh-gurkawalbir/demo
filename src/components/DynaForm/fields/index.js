import DynaMultiSelect from './DynaMultiSelect';
import DynaRadioGroup from './DynaRadioGroup';
import DynaSelect from './DynaSelect';
import DynaLabel from './DynaLabel';
import DynaCeligoTable from './DynaCeligoTable';
import DynaSelectResource from './DynaSelectResource';
import DynaSelectApplication from './DynaSelectApplication';
import DynaFileTypeSelect from './select/DynaFileTypeSelect';
import DynaText from './DynaText';
import DynaCheckbox from './DynaCheckbox';
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
import DynaGenerateToken from './DynaGenerateToken';
import DynaSelectForSetFields from './select/DynaSelectForSetFields';
import DynaTextForSetFields from './text/DynaTextForSetFields';
import DynaRefreshableIntegrationAppSetting from './DynaRefreshableSelect/RefreshableIntegrationAppSetting';
import DynaDate from './dateTime/DynaDate';
import DynaSQLQueryBuilder from './DynaSQLQueryBuilder';
import DynaRelativeURIWithLookup from './DynaRelativeURIWithLookup';

export default {
  mapping: DynaImportMapping,
  toggleSelectToText: DynaToggleSelectToText,
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
  xmlparse: DynaXmlParse,
  refreshableselect: DynaRefreshableSelect,
  transformeditor: DynaTransformEditor,
  responsetransformeditor: DynaResponseTransformEditor,
  ftpport: DynaTextFtpPort,
  uploadfile: DynaUploadFile,
  labeltitle: DynaLabel,
  celigotable: DynaCeligoTable,
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
  generatetoken: DynaGenerateToken,
  selectforsetfields: DynaSelectForSetFields,
  textforsetfields: DynaTextForSetFields,
  integrationapprefreshableselect: DynaRefreshableIntegrationAppSetting,
  date: DynaDate,
  sqlquerybuilder: DynaSQLQueryBuilder,
  relativeuriwithlookup: DynaRelativeURIWithLookup,
};
