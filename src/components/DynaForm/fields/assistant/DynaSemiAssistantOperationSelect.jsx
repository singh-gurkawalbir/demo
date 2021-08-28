import React from 'react';
import { useSelector } from 'react-redux';
import { flatten } from 'flat';
import { selectors } from '../../../../reducers';
import DynaSelect from '../DynaSelect';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { semiAssistantExportOperationOptions, semiAssistantExportConfig } from './util';
import useConfirmDialog from '../../../ConfirmDialog';
import useFormContext from '../../../Form/FormContext';
import { getAssistantConnectorType } from '../../../../constants/applications';

export default function DynaSemiAssistantOperationSelect(props) {
  const { label = 'Select an operation', resourceType, flowId, resourceId, formKey, value, onFieldChange } = props;
  const formContext = useFormContext(formKey);
  const { merged } =
    useSelectorMemo(
      selectors.makeResourceDataSelector,
      resourceType,
      resourceId
    ) || {};
  const staggedResource = merged;
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', staggedResource?._connectionId)
  );
  const { assistant } = connection || {};

  const assistantData = useSelector(state =>
    selectors.assistantData(state, {
      adaptorType: getAssistantConnectorType(staggedResource) === 'rest' ? 'rest' : 'http',
      assistant,
    })
  );
  const options = semiAssistantExportOperationOptions(assistantData);
  const { confirmDialog } = useConfirmDialog();
  const onFieldChangeFn = (id, value) => {
    confirmDialog({
      title: 'Confirm',
      message: 'This will clear some of the http field values and populate them with the default values for the selected operation. Are you sure want to proceed?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const assistantConfig = semiAssistantExportConfig(assistantData, value);
            const flattenedAssistantConfig = flatten(assistantConfig);

            onFieldChange(id, value);
            Object.keys(formContext.fields).forEach(fieldId => {
              if (fieldId.startsWith('http.') || fieldId === 'type' || fieldId.startsWith('delta.') || fieldId.startsWith('once.')) {
                if (Object.hasOwnProperty.call(flattenedAssistantConfig, fieldId)) {
                  onFieldChange(fieldId, flattenedAssistantConfig[fieldId]);
                } else {
                  onFieldChange(fieldId, '');
                }
              }
            });
          },
        },
        {
          label: 'Cancel',
          color: 'secondary',
        },
      ],
    });
  };

  const showSemiAssistantOperationSelect = flowId && assistant === 'openair';

  return showSemiAssistantOperationSelect ? (
    <DynaSelect
      {...props}
      label={label}
      onFieldChange={onFieldChangeFn}
      value={value}
      options={options}
    />
  ) : null;
}

