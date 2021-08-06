import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { safeParse } from '../../../../utils/string';
import useFormContext from '../../../Form/FormContext';

function extractResourcePath(value, initialResourcePath) {
  if (value) {
    const jsonValue = safeParse(value) || {};

    return jsonValue.resourcePath;
  }

  return initialResourcePath;
}

export default function FileDefinitionChange({editorId, formKey, fieldId, resourceType, resourceId}) {
  const dispatch = useDispatch();
  const formContext = useFormContext(formKey);
  const isEditorActive = useSelector(state => selectors.editor(state, editorId).id);
  const parserType = resourceType === 'imports' ? 'fileDefinitionGenerator' : 'fileDefinitionParser';

  const fieldState = useSelector(state => selectors.fieldState(state, formKey, fieldId));

  const {userDefinitionId, fileDefinitionResourcePath, value: fieldValue, options: fieldOptions} = fieldState;
  const { format, definitionId } = fieldOptions || {};
  const resourcePath = extractResourcePath(fieldValue, fileDefinitionResourcePath);

  const { sampleData, rule } = useSelector(state => selectors.fileDefinitionSampleData(state, {
    userDefinitionId,
    resourceType,
    options: { format, definitionId, resourcePath },
  }), shallowEqual);

  useEffect(() => {
    // patch only if sampleData/rule is changed and editor state is active
    if (sampleData) {
      if (isEditorActive) {
        dispatch(actions.editor.patchData(editorId, sampleData));
      }
      dispatch(
        actions.sampleData.request(
          resourceId,
          resourceType,
          {
            type: parserType,
            file: sampleData,
            editorValues: { rule, data: sampleData },
            formValues: formContext.value,
          },
          'file'
        )
      );
    }
    if (rule) {
      if (isEditorActive) {
        dispatch(actions.editor.patchRule(editorId, rule));
      }
      // todo @raghu, we need to handle below onFieldChange inside
      // DynaFileDefinitionSelect.jsx
      dispatch(actions.form.fieldChange(formKey)(fieldId, rule));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleData, rule]);

  return null;
}
