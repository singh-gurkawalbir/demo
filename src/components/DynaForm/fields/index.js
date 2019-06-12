import DynaMultiSelect from './DynaMultiSelect';
import DynaRadioGroup from './DynaRadioGroup';
import DynaSelect from './DynaSelect';
import DynaLabel from './DynaLabel';
import DynaSelectResource from './DynaSelectResource';
import DynaText from './DynaText';
import DynaCheckbox from './DynaCheckbox';
import DynaRelativeUri from './DynaRelativeUri';
import DynaKeyValue from './DynaKeyValue';
import DynaEditor from './DynaEditor';
import DynaCsvParse from './DynaCsvParse';
import DynaRefreshOptions from './DynaRefreshOptions/RefreshOptionsFactory';
import DynaTransformEditor from './DynaTransformEditor';
import DynaTextFtpPort from './CustomComponents/DynaTextFtpPort';
import DynaUploadFile from './CustomComponents/DynaUploadFile';
import DynaHook from './DynaHook';
import DynaScriptContent from './DynaScriptContent';
import DynaScopesEditor from './DynaScopes';

export default {
  scopeseditor: DynaScopesEditor,
  text: DynaText,
  editor: DynaEditor,
  textarea: DynaText,
  checkbox: DynaCheckbox,
  select: DynaSelect,
  selectresource: DynaSelectResource,
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
};
