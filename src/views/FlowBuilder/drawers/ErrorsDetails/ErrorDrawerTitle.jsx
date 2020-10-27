import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import Spinner from '../../../../components/Spinner';

const useStyles = makeStyles(theme => ({
  status: {
    margin: 'auto',
    paddingLeft: theme.spacing(0.5),
    color: theme.palette.secondary.main,
  },
  spinnerWrapper: {
    margin: theme.spacing(0.5, 0, 0, 1),
  },
  divider: {
    width: 1,
    height: 30,
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: theme.spacing(0, 2, 0, 2),
  },
  flexContainer: {
    display: 'flex',
  },
}));
export default function ErrorDrawerTitle({ flowId }) {
  const match = useRouteMatch();
  const classes = useStyles();
  const { resourceId } = match?.params || {};
  const resourceName = useSelector(state => {
    if (!resourceId) return;
    const exportObj = selectors.resource(state, 'exports', resourceId);

    if (exportObj?.name) return exportObj.name;

    return selectors.resource(state, 'imports', resourceId)?.name;
  });

  const isRetrying = useSelector(
    state => selectors.retryStatus(state, flowId, resourceId) === 'retrying'
  );

  if (!match) return null;

  return (
    <div className={classes.flexContainer}>
      <span> Errors: {resourceName} </span>
      {
        isRetrying && (
          <>
            <div className={classes.divider} />
            <div className={classes.flexContainer}>
              <Spinner size={16} className={classes.spinnerWrapper} />
              <Typography variant="body2" component="div" className={classes.status}>  Retrying errors...</Typography>
            </div>
          </>
        )
      }
    </div>
  );
}
