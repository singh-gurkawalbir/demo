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
import DynaTransformEditor from './DynaTransformEditor';
import DynaTextFtpPort from './CustomComponents/DynaTextFtpPort';
import DynaUploadFile from './CustomComponents/DynaUploadFile';
import DynaHook from './DynaHook';
import DynaScriptContent from './DynaScriptContent';

export default {
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
  transformeditor: DynaTransformEditor,
  ftpport: DynaTextFtpPort,
  uploadFile: DynaUploadFile,
  labelTitle: DynaLabel,
  hook: DynaHook,
  scriptcontent: DynaScriptContent,
};
