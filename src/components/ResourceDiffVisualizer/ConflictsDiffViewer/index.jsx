import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  conflictPanelWrapper: {
    padding: theme.spacing(2),
  },
  conflictTitle: {
    display: 'flex',
    paddingLeft: theme.spacing(3),
    marginBottom: theme.spacing(1),
    '&>.MuiTypography-root': {
      flex: 1,
    },
  },
  conflictRow: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    '&>.MuiTypography-root': {
      width: theme.spacing(3),
    },
  },
  conflictContentWrapper: {
    display: 'flex',
    flex: 1,
    border: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(1, 2),
    borderRadius: 4,
  },
  conflictDiffColumn: {
    flex: 1,
  },
}));
export default function ConflictsDiffViewer({leftTitle = 'Current', rightTitle = 'Remote' }) {
  const classes = useStyles();

  return (
    <div className={classes.conflictPanelWrapper}>
      <div className={classes.conflictTitle}>
        <Typography variant="body2">{leftTitle}</Typography>
        <Typography variant="body2">{rightTitle}</Typography>
      </div>
      <div className={classes.conflictRow}>
        <Typography variant="body2">1</Typography>
        <div className={classes.conflictContentWrapper}>
          <div className={classes.conflictDiffColumn}>
            <Typography variant="body2"><b>Path:</b> dummy text</Typography>
            <Typography variant="body2"><b>Operation:</b> dummy text</Typography>
            <Typography variant="body2"><b>Value:</b> dummy text</Typography>
          </div>
          <div className={classes.conflictDiffColumn}>
            <Typography variant="body2"><b>Path:</b> dummy text</Typography>
            <Typography variant="body2"><b>Operation:</b> dummy text</Typography>
            <Typography variant="body2"><b>Value:</b> dummy text</Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
