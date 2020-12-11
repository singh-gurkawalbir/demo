import {
  call,
  put,
  select,
} from 'redux-saga/effects';
import { selectors } from '../../../reducers';
import { constructResourceFromFormValues } from '../../utils';
import actions from '../../../actions';

function* init({ id }) {
  const editor = yield select(selectors._editor, id);
  const { resourceId, resourceType, formKey, fieldId, rule} = editor;

  const formState = yield select(selectors.formState, formKey);
  const fieldState = yield select(selectors.fieldState, formKey, fieldId);

  const { value: formValues } = formState || {};
  const isEditorV2Supported = yield select(selectors._isEditorV2Supported, id);
  let v1Rule;
  let v2Rule;

  if (isEditorV2Supported) {
    v1Rule = rule;
    v2Rule = rule;
  }

  const resource = yield call(constructResourceFromFormValues, {
    formValues,
    resourceId,
    resourceType,
  });
  const { _connectionId: connectionId } = resource;

  const connection = yield select(selectors.resource, 'connections', connectionId);
  const connectionMediaType = connection?.type === 'http' ? connection?.http?.mediaType : connection?.rest?.mediaType;

  const contentType = fieldState?.options?.contentType || fieldState?.contentType || connectionMediaType;
  const resultMode = contentType === 'json' ? 'json' : 'xml';

  yield put(actions._editor.patchFeatures(id, { isEditorV2Supported, resultMode, editorTitle: fieldState?.label, v1Rule, v2Rule }));
}

export default {
  init,
};
