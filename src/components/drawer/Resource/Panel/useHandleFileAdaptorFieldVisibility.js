import { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { selectors } from '../../../../reducers';
import { fileDefinitionFormatFieldsMap } from '../../../../utils/file';
import actions from '../../../../actions';

const ELIGIBLE_RESOURCE_TYPES = ['exports', 'imports'];
const FILE_DEFINITION_RULES_FIELD_ID = 'file.filedefinition.rules';

export default function useHandleFileAdaptorFieldVisibility(formKey) {
  const fileDefinitionTypes = Object.keys(fileDefinitionFormatFieldsMap);
  const formatFieldIds = Object.values(fileDefinitionFormatFieldsMap);

  const dispatch = useDispatch();
  const { fileType, inputMode, outputMode, ...formatFieldValues } = useSelector(state => {
    const formContext = selectors.formState(state, formKey) || {};
    const formValues = formContext.value || {};
    const formatFieldValues = formatFieldIds.reduce((acc, fieldId) => {
      acc[fieldId] = formValues[`/${fieldId.replace('.', '/')}`];

      return acc;
    }, {});

    return {
      fileType: formValues['/file/type'],
      outputMode: formValues['/outputMode'],
      inputMode: formValues['/inputMode'],
      ...formatFieldValues,
    };
  }, shallowEqual);
  const { resourceType, resourceId } = useSelector(state => {
    const parentContext = selectors.formParentContext(state, formKey) || {};

    return {...parentContext};
  }, shallowEqual);

  const isFileAdaptorResource = useSelector(() => ELIGIBLE_RESOURCE_TYPES.includes(resourceType));

  const resource = useSelector(state => selectors.resourceData(state, { resourceType, resourceId })?.merged, shallowEqual);

  const userDefinitionId = resource?.file?.fileDefinition?._fileDefinitionId;
  const mode = resourceType === 'exports' ? outputMode : inputMode;

  // Below useEffect deals with file definition format fields visibility
  useEffect(() => {
    if (!isFileAdaptorResource) { return; }

    if (userDefinitionId) {
      // Incase file definition rules are already set, we do not show format fields

      formatFieldIds.forEach(fieldId => {
        dispatch(actions.form.forceFieldState(formKey)(fieldId, { visible: false }));
      });
    } else {
      // We just show the corresponding format field when user selects file definition type
      // Other format fields would be hidden
      formatFieldIds.forEach(fieldId => {
        const visible = fileDefinitionFormatFieldsMap[fileType] === fieldId && mode === 'records';

        dispatch(actions.form.forceFieldState(formKey)(fieldId, { visible }));
      });
    }
  }, [fileType, userDefinitionId, mode, dispatch, fileDefinitionTypes, formKey, isFileAdaptorResource, formatFieldIds]);

  // Below useEffect deals with file definition rules field visibility
  useEffect(() => {
    if (!isFileAdaptorResource) { return; }
    if (userDefinitionId) {
      const visible = fileDefinitionTypes.includes(fileType);

      // we always show as and when user selects file definition type
      dispatch(actions.form.forceFieldState(formKey)(FILE_DEFINITION_RULES_FIELD_ID, { visible }));
    } else {
      const visible = !!formatFieldValues[fileDefinitionFormatFieldsMap[fileType]] && mode === 'records';

      // we only show when user selects  file definition format and mode is records
      dispatch(actions.form.forceFieldState(formKey)(FILE_DEFINITION_RULES_FIELD_ID, { visible }));
    }
  }, [fileType, userDefinitionId, resourceType, mode, dispatch, fileDefinitionTypes, formKey, isFileAdaptorResource, formatFieldValues]);
}
