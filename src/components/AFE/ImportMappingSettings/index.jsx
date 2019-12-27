import React from 'react';
import Button from '@material-ui/core/Button';
import { Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DynaForm from '../../DynaForm';
import DynaSubmit from '../../DynaForm/DynaSubmit';
import ApplicationMappingSettings from './application';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import DrawerTitleBar from '../../drawer/TitleBar';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 824,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    backgroundColor: theme.palette.background.white,
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
    overflow: 'auto',

    padding: theme.spacing(3),
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '& > div:first-child': {
      height: `calc(100vh - 180px)`,
    },
  },
}));

export default function ImportMappingSettings(props) {
  const {
    title,
    value,
    onClose,
    open,
    extractFields,
    generateFields,
    lookup,
    updateLookup,
    application,
    options,
    disabled,
  } = props;
  const classes = useStyles();
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
    <Drawer
      anchor="right"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}>
      <DrawerTitleBar onClose={() => onClose(false)} title={title} />
      <div className={classes.content}>
        <DynaForm
          disabled={disabled}
          fieldMeta={fieldMeta}
          optionsHandler={fieldMeta.optionsHandler}>
          <DynaSubmit
            disabled={disabled}
            id="fieldMappingSettingsSave"
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
    </Drawer>
  );
}
