import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import useConfirmDialog from '../../../../components/ConfirmDialog';
import CopyIcon from '../../../../components/icons/CopyIcon';
import { TextButton } from '../../../../components/Buttons';
import IconButtonWithTooltip from '../../../../components/IconButtonWithTooltip';
import { useFieldPickerContext } from '../FieldPickerContext';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    height: '100%',
  },
  titleBar: {
    display: 'flex',
  },
  log: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  clearAll: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  fieldList: {
    marginLeft: theme.spacing(2),
  },
  resourceLabel: {
    marginTop: theme.spacing(1),
    fontWeight: 'bold',
  },
}));

export default function ChangeLog() {
  const classes = useStyles();
  const { clearAllFields, changeSet } = useFieldPickerContext();
  const { confirmDialog } = useConfirmDialog();

  const handleCopy = text => {
    // eslint-disable-next-line no-console
    console.log(text);
  };

  const handleClear = () => {
    confirmDialog({
      title: 'Confirm removal',
      message: 'Are you sure you want to remove all requested PII changes?',
      buttons: [
        {
          label: 'Clear',
          onClick: clearAllFields,
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  };

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.titleBar}>
          <Typography variant="h3">Proposed changes</Typography>

          <CopyToClipboard
            onCopy={handleCopy}
            text={JSON.stringify(changeSet, null, 2)}>
            <IconButtonWithTooltip
              tooltipProps={{title: 'Copy proposed changes to clipboard', placement: 'bottom'}}
              buttonSize={{size: 'small'}}>
              <CopyIcon />
            </IconButtonWithTooltip>
          </CopyToClipboard>

          <div className={classes.clearAll}>
            <TextButton onClick={handleClear}>Clear All</TextButton>
          </div>
        </div>

        <Typography variant="caption">Send these field paths to UI team for updating.</Typography>
      </div>

      <div className={classes.log}>
        {Object.keys(changeSet).map(resourceType => (
          <div key={resourceType}>
            {Object.keys(changeSet[resourceType]).length > 0 && (
              <Typography className={classes.resourceLabel} variant="body2">
                {resourceType}
              </Typography>
            )}
            <div className={classes.fieldList}>
              {Object.keys(changeSet[resourceType]).map(fieldId => (
                <div key={fieldId}>
                  <Typography variant="body2" component="span">
                    <b>{fieldId}</b>
                  </Typography>
                  {changeSet[resourceType][fieldId]
                    ? (<Typography variant="inherit"> (safe) </Typography>)
                    : (<Typography variant="inherit" color="error"> (PII) </Typography>)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
