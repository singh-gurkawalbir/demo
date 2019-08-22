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
import DynaRefreshableSelect from './DynaRefreshableSelect';
import DynaTransformEditor from './DynaTransformEditor';
import DynaTextFtpPort from './DynaTextFtpPort';
import DynaUploadFile from './DynaUploadFile';
import DynaHook from './DynaHook';
import DynaScriptContent from './DynaScriptContent';
import DynaSelectScopes from './DynaSelectScopes';
import DynaTokenGenerator from './DynaTokenGenerator';
import DynaApiIdentifier from './DynaApiIdentifier';
import DynaNetsuiteUserRolesOptions from './DynaNetsuiteUserRoles';
import DynaNSSavedSearch from './DynaNSSavedSearch';
import DynaLookupEditor from './DynaLookupEditor';
import DynaKeyWithAction from './DynaKeyWithAction';

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
  importLookup: DynaLookupEditor,
  keyvalue: DynaKeyValue,
  dynakeywithaction: DynaKeyWithAction,
  csvparse: DynaCsvParse,
  refreshableselect: DynaRefreshableSelect,
  transformeditor: DynaTransformEditor,
  ftpport: DynaTextFtpPort,
  uploadfile: DynaUploadFile,
  labeltitle: DynaLabel,
  hook: DynaHook,
  scriptcontent: DynaScriptContent,
  tokengen: DynaTokenGenerator,
  apiidentifier: DynaApiIdentifier,
  netsuiteuserroles: DynaNetsuiteUserRolesOptions,
  nssavedsearch: DynaNSSavedSearch,
};
