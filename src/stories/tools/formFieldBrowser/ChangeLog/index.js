import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles, Typography } from '@material-ui/core';
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
              tooltipProps={{title: 'Copy to clipboard', placement: 'bottom'}}
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
        {Object.keys(changeSet).map(fieldId => (
          <div key={fieldId}>
            <Typography component="span"><b>{fieldId}</b> </Typography>
            {changeSet[fieldId]
              ? (<Typography component="span"> (safe) </Typography>)
              : (<Typography component="span" color="error"> (PII) </Typography>)}
          </div>
        ))}
      </div>
    </div>
  );
}
