import createSelectComponent from './selectComponentMeta';
import createCheckboxComponent from './checkboxComponent';
import createTextFieldComponent from './textFieldComponent';
import createNameValueComponent from './customKeyValuePairComponent';
import createArrayComponent from './arrayTextFieldComponent';
import createEditorComponent from './editorComponent';

const isASelectElement = fieldDefs =>
  fieldDefs && fieldDefs.enumValues && fieldDefs.enumValues.length > 0;
const isACheckBoxElement = fieldDefs =>
  fieldDefs && fieldDefs.instance && fieldDefs.instance === 'Boolean';
const isANameValueElement = fieldDefs =>
  fieldDefs &&
  fieldDefs.pathGeneratedFromObj &&
  fieldDefs.pathGeneratedFromObj.endsWith('[*].name');
const isAnArrayTextFieldComponent = fieldDefs =>
  fieldDefs &&
  fieldDefs.pathGeneratedFromObj &&
  fieldDefs.pathGeneratedFromObj.endsWith('[*]');
const isAnEditorComponent = fieldDefs =>
  fieldDefs &&
  fieldDefs.pathGeneratedFromObj &&
  fieldDefs.pathGeneratedFromObj.endsWith('[*].id');

export default (fieldDefs, resourceType) => {
  if (isASelectElement(fieldDefs)) {
    return createSelectComponent(fieldDefs, resourceType);
  }

  if (isACheckBoxElement(fieldDefs)) {
    return createCheckboxComponent(fieldDefs, resourceType);
  }

  if (isANameValueElement(fieldDefs))
    return createNameValueComponent(fieldDefs, resourceType);

  if (isAnArrayTextFieldComponent(fieldDefs))
    return createArrayComponent(fieldDefs, resourceType);

  if (isAnEditorComponent(fieldDefs))
    return createEditorComponent(fieldDefs, resourceType);

  return createTextFieldComponent(fieldDefs, resourceType);
};
