import { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { selectors } from '../../../../reducers';
import { fileDefinitionFormatFieldsMap } from '../../../../utils/file';
import actions from '../../../../actions';

export const FILE_DEFINITION_RULES_FIELD_ID = 'file.filedefinition.rules';

const fileDefinitionTypes = Object.keys(fileDefinitionFormatFieldsMap);
const formatFieldIds = Object.values(fileDefinitionFormatFieldsMap);

export default function useHandleFileDefinitionFieldVisibility(formKey) {
  const dispatch = useDispatch();
  const { fileType, inputMode, outputMode, connectionId } = useSelector(state => {
    const formContext = selectors.formState(state, formKey) || {};
    const formValues = formContext.value || {};

    return {
      fileType: formValues['/file/type'],
      outputMode: formValues['/outputMode'],
      inputMode: formValues['/inputMode'],
      connectionId: formValues['/_connectionId'],
    };
  }, shallowEqual);

  const stringifiedFormatFieldValues = useSelector(state => {
    const formContext = selectors.formState(state, formKey) || {};
    const formValues = formContext.value || {};
    const formatFieldValues = formatFieldIds.reduce((acc, fieldId) => {
      acc[fieldId] = formValues[`/${fieldId.replace('.', '/')}`];

      return acc;
    }, {});

    // Stringified field values in order to avoid unnecessary re-renders in the below useEffect
    return JSON.stringify(formatFieldValues);
  });

  const { resourceType, resourceId } = useSelector(state => {
    const parentContext = selectors.formParentContext(state, formKey) || {};

    return {...parentContext};
  }, shallowEqual);

  const resourceCanHaveFileDefinitions = useSelector(state => selectors.resourceCanHaveFileDefinitions(state, resourceId, resourceType));

  const userDefinitionId = useSelector(state => {
    const resource = selectors.resourceData(state, resourceType, resourceId)?.merged;

    return resource?.file?.fileDefinition?._fileDefinitionId;
  });

  const mode = resourceType === 'exports' ? outputMode : inputMode;

  // Below useEffect deals with file definition format fields visibility
  useEffect(() => {
    if (!resourceCanHaveFileDefinitions) { return; }

    if (userDefinitionId) {
      // Incase file definition rules are already set, we do not show format fields

      formatFieldIds.forEach(fieldId => {
        dispatch(actions.form.forceFieldState(formKey)(fieldId, { visible: false }));
      });
    } else {
      // We just show the corresponding format field when user selects file definition type
      // Other format fields would be hidden
      formatFieldIds.forEach(fieldId => {
        const visible = fileDefinitionFormatFieldsMap[fileType] === fieldId && mode !== 'blob';

        dispatch(actions.form.forceFieldState(formKey)(fieldId, { visible }));
      });
    }
  }, [fileType, userDefinitionId, mode, dispatch, formKey, resourceCanHaveFileDefinitions, connectionId]);

  // Below useEffect deals with file definition rules field visibility
  useEffect(() => {
    if (!resourceCanHaveFileDefinitions) { return; }
    if (userDefinitionId) {
      const visible = fileDefinitionTypes.includes(fileType);

      // we always show as and when user selects file definition type
      dispatch(actions.form.forceFieldState(formKey)(FILE_DEFINITION_RULES_FIELD_ID, { visible }));
    } else {
      const formatFields = JSON.parse(stringifiedFormatFieldValues);
      const visible = !!formatFields[fileDefinitionFormatFieldsMap[fileType]] && mode !== 'blob';

      // we only show when user selects  file definition format and mode is records
      dispatch(actions.form.forceFieldState(formKey)(FILE_DEFINITION_RULES_FIELD_ID, { visible }));
    }
  }, [fileType, userDefinitionId, resourceType, mode, dispatch, formKey, resourceCanHaveFileDefinitions, stringifiedFormatFieldValues, connectionId]);
}
