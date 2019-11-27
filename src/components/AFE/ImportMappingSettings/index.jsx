import React from 'react';
import Button from '@material-ui/core/Button';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import ApplicationMappingSettings from './application';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import ModalDialog from '../../ModalDialog';

export default function ImportMappingSettings(props) {
  const {
    title,
    value,
    onClose,
    extractFields,
    generateFields,
    lookup,
    updateLookup,
    application,
    options,
    disabled,
  } = props;
  const { generate, extract, index } = value;
  const [enquesnackbar] = useEnqueueSnackbar();
  const fieldMeta = ApplicationMappingSettings.getMetaData({
    application,
    value,
    lookup,
    extractFields,
    generate,
    generateFields,
    options,
  });
  const handleSubmit = formVal => {
    const {
      settings,
      lookup: updatedLookup,
      errorStatus,
      errorMessage,
    } = ApplicationMappingSettings.getFormattedValue(
      { generate, extract, lookup },
      formVal
    );

    if (errorStatus) {
      enquesnackbar({
        message: errorMessage,
        variant: 'error',
      });

      return;
    }

    // Update lookup
    if (updatedLookup) {
      const isDelete = false;

      updateLookup(isDelete, updatedLookup);
    } else if (lookup) {
      // When user tries to reconfigure setting and tries to remove lookup, delete existing lookup
      const isDelete = true;

      updateLookup(isDelete, lookup);
    }

    onClose(true, settings);
  };

  return (
    <ModalDialog handleClose={onClose} show maxWidth="lg">
      <div>{title}</div>
      <div>
        <DynaForm
          disabled={disabled}
          fieldMeta={fieldMeta}
          optionsHandler={fieldMeta.optionsHandler}>
          <DynaSubmit
            disabled={disabled}
            id={`fieldMappingSettingsSave-${index}`}
            onClick={handleSubmit}>
            Save
          </DynaSubmit>
          <Button
            data-test={`fieldMappingSettingsCancel-${index}`}
            variant="text"
            color="primary"
            onClick={() => {
              onClose(false);
            }}>
            Cancel
          </Button>
        </DynaForm>
      </div>
    </ModalDialog>
  );
}
