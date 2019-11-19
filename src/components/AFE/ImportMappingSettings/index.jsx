import React from 'react';
import Button from '@material-ui/core/Button';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import ApplicationMappingSettings from './application';
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
  const { generate, extract } = value;
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
    const mappingObj = ApplicationMappingSettings.getFormattedValue(
      { generate, extract, lookup },
      formVal
    );

    // Update lookup
    if (mappingObj.lookup) {
      const isDelete = false;

      updateLookup(isDelete, mappingObj.lookup);
    } else if (lookup) {
      // When user tries to reconfigure setting and tries to remove lookup, delete existing lookup
      const isDelete = true;

      updateLookup(isDelete, lookup);
    }

    onClose(true, mappingObj.settings);
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
            data-test="saveMappingSettings"
            onClick={handleSubmit}>
            Save
          </DynaSubmit>
          <Button
            data-test="cancelMappingSettings"
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
