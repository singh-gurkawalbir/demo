import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { safeParse } from '../../../../utils/string';

function extractResourcePath(value, initialResourcePath) {
  if (value) {
    const jsonValue = safeParse(value) || {};

    return jsonValue.resourcePath;
  }

  return initialResourcePath;
}

export default function FileDefinitionChange({editorId, formKey, fieldId, resourceType, importHasMappings}) {
  const dispatch = useDispatch();
  const isEditorActive = useSelector(state => selectors.editor(state, editorId).id);

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
      // patch the predefined sample data only if there are no mappings
      if (isEditorActive && !importHasMappings) {
        dispatch(actions.editor.patchData(editorId, sampleData));
      }
      dispatch(actions.resourceFormSampleData.request(formKey));
    }
    if (rule) {
      if (isEditorActive) {
        dispatch(actions.editor.patchRule(editorId, rule));
      }
      // todo @raghu, we need to handle below onFieldChange inside
      // DynaFileDefinitionSelect.jsx
      dispatch(actions.form.fieldChange(formKey)(fieldId, rule, true));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleData, rule, importHasMappings]);

  return null;
}
