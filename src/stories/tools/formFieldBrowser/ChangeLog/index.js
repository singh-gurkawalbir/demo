import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeStyles, Typography } from '@material-ui/core';
import CopyIcon from '../../../../components/icons/CopyIcon';
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
}));

export default function ChangeLog() {
  const classes = useStyles();
  const { changeSet } = useFieldPickerContext();

  const handleCopy = text => {
    // eslint-disable-next-line no-console
    console.log(text);
  };

  return (
    <div className={classes.container}>
      <div className={classes.titleBar}>
        <Typography variant="h3">Change log</Typography>

        <CopyToClipboard
          onCopy={handleCopy}
          text={JSON.stringify(changeSet, null, 2)}>
          <IconButtonWithTooltip
            tooltipProps={{title: 'Copy to clipboard', placement: 'bottom'}}
            buttonSize={{size: 'small'}}>
            <CopyIcon />
          </IconButtonWithTooltip>
        </CopyToClipboard>
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
