import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  makeStyles,
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
    onClose,
    extractFields,
    lookup,
    updateLookup,
    application,
  } = props;
  const { generate, extract } = value;
  const classes = useStyles();
  const fieldMeta = ApplicationMappingSettings.getMetaData({
    application,
    value,
    lookup,
    extractFields,
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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={classes.modalContent}>
        <DynaForm
          fieldMeta={fieldMeta}
          optionsHandler={fieldMeta.optionsHandler}>
          <Button
            onClick={() => {
              onClose(false);
            }}>
            Cancel
          </Button>
          <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
        </DynaForm>
      </DialogContent>
    </Dialog>
  );
}
