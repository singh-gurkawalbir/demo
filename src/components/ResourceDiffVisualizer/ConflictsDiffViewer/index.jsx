import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import { fetchConflictsOnBothBases } from '../utils';

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
    '&>.MuiTypography-root': {
      marginBottom: theme.spacing(1),
    },
  },
  container: {
    '& pre': {
      fontFamily: 'source sans pro',
      fontSize: 16,
      marginTop: theme.spacing(0.5),
      marginRight: theme.spacing(2),
      backgroundColor: theme.palette.background.paper2,
      padding: theme.spacing(1),
      border: `1px solid ${theme.palette.secondary.lightest}`,
      borderRadius: 4,
    },
  },
}));

const ConflictValue = ({ value }) => {
  const classes = useStyles();

  if (typeof value !== 'object') return value;

  return (
    <div className={classes.container}>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};

const Conflict = ({ current, remote, index }) => {
  const classes = useStyles();

  return (
    <div className={classes.conflictRow} key={index}>
      <Typography variant="body2">{index}</Typography>
      <div className={classes.conflictContentWrapper}>
        <div className={classes.conflictDiffColumn}>
          <Typography variant="body2"><b>Path:</b> {current.path}</Typography>
          <Typography variant="body2"><b>Operation:</b> {current.op}</Typography>
          {current.value && <Typography variant="body2"><b>Value:</b> <ConflictValue value={current.value} /></Typography>}
        </div>
        <div className={classes.conflictDiffColumn}>
          <Typography variant="body2"><b>Path:</b> {remote.path}</Typography>
          <Typography variant="body2"><b>Operation:</b> {remote.op}</Typography>
          {remote.value && <Typography variant="body2"><b>Value:</b> <ConflictValue value={remote.value} /></Typography>}
        </div>
      </div>
    </div>
  );
};
export default function ConflictsDiffViewer(props) {
  const {leftTitle = 'Current', rightTitle = 'Remote', conflicts } = props;
  const classes = useStyles();
  const readableConflicts = useMemo(() => fetchConflictsOnBothBases(conflicts), [conflicts]);

  return (
    <div className={classes.conflictPanelWrapper}>
      <div className={classes.conflictTitle}>
        <Typography variant="body2"><b>{leftTitle}</b></Typography>
        <Typography variant="body2"><b>{rightTitle}</b></Typography>
      </div>
      {
        readableConflicts.map((conflict, index) => (
          <Conflict
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            current={conflict.current}
            remote={conflict.remote}
            index={index + 1} />
        ))
      }

    </div>
  );
}
