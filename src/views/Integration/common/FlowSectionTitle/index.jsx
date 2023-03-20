import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../reducers';
import Status from '../../../../components/Buttons/Status';
import StatusCircle from '../../../../components/StatusCircle';
import CeligoTruncate from '../../../../components/CeligoTruncate';

const useStyles = makeStyles(theme => ({
  gridContainer: {
    display: 'grid',
    gridColumnGap: theme.spacing(1),
    gridTemplateColumns: `auto ${theme.spacing(7)}`,
    position: 'relative',
    '& > div:first-child': {
      wordBreak: 'break-word',
    },
  },
}));

const NoFlowsSection = () => (
  <Typography variant="caption" color="textSecondary">No flows</Typography>
);

export default function FlowSectionTitle({ title, errorCount = 0, groupHasNoFlows }) {
  const classes = useStyles();
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  const errorStatus = useMemo(() => {
    if (errorCount === 0) {
      return <StatusCircle size="mini" variant="success" />;
    }

    return (
      <Status size="mini" variant="error" >
        <span>{errorCount > 9999 ? '9999+' : errorCount}</span>
      </Status>
    );
  }, [errorCount]);

  if (!isUserInErrMgtTwoDotZero) {
    return title;
  }

  return (
    <span className={classes.gridContainer}>
      <CeligoTruncate placement="right" lines={3} isLoggable>
        {title}
      </CeligoTruncate>
      <span> { groupHasNoFlows ? <NoFlowsSection /> : errorStatus} </span>
    </span>
  );
}
