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
import DynaEditor from './DynaEditor';
import DynaCsvParse from './DynaCsvParse';
import DynaRefreshOptions from './DynaRefreshOptions/RefreshOptionsFactory';
import DynaTransformEditor from './DynaTransformEditor';
import DynaTextFtpPort from './DynaTextFtpPort';
import DynaUploadFile from './DynaUploadFile';
import DynaHook from './DynaHook';
import DynaScriptContent from './DynaScriptContent';
import DynaSelectScopes from './DynaSelectScopes';
import DynaTokenGenerator from './DynaTokenGenerator';
import DynaApiIdentifier from './DynaApiIdentifier';
import DynaNSSavedSearch from './DynaNSSavedSearch';

export default {
  selectscopes: DynaSelectScopes,
  text: DynaText,
  editor: DynaEditor,
  textarea: DynaText,
  checkbox: DynaCheckbox,
  select: DynaSelect,
  selectresource: DynaSelectResource,
  selectapplication: DynaSelectApplication,
  multiselect: DynaMultiSelect,
  radiogroup: DynaRadioGroup,
  relativeuri: DynaRelativeUri,
  keyvalue: DynaKeyValue,
  csvparse: DynaCsvParse,
  refreshoptions: DynaRefreshOptions,
  transformeditor: DynaTransformEditor,
  ftpport: DynaTextFtpPort,
  uploadfile: DynaUploadFile,
  labeltitle: DynaLabel,
  hook: DynaHook,
  scriptcontent: DynaScriptContent,
  tokengen: DynaTokenGenerator,
  apiidentifier: DynaApiIdentifier,
  nssavedsearch: DynaNSSavedSearch,
};
