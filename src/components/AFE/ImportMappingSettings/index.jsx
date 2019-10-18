import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import ApplicationMappingSettings from './application';

const useStyles = makeStyles(() => ({
  modalContent: {
    width: '70vw',
  },
}));

export default function ImportMappingSettings(props) {
  const {
    title,
    value,
    // connectionId,
    onClose,
    extractFields,
    generateFields,
    lookup,
    updateLookup,
    application,
    // recordType,
    options,
  } = props;
  const { generate, extract } = value;
  const classes = useStyles();
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
    <Dialog open maxWidth={false}>
      <DialogTitle disableTypography>
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <DynaForm
          fieldMeta={fieldMeta}
          optionsHandler={fieldMeta.optionsHandler}>
          <Button
            data-test="cancelMappingSettings"
            onClick={() => {
              onClose(false);
            }}>
            Cancel
          </Button>
          <DynaSubmit data-test="saveMappingSettings" onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </DynaForm>
      </DialogContent>
    </Dialog>
  );
}
