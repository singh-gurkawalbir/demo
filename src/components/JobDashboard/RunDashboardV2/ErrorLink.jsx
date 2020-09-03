import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';

const useStyles = makeStyles(theme => ({
  errorLink: {
    color: theme.palette.error.main,
  },
}));

export default function ErrorLink({ job }) {
  const { _exportId, _importId, numError} = job;
  const classes = useStyles();
  const match = useRouteMatch();
  const resourceId = _exportId || _importId;
  const { flowId } = match?.params || {};
  const path = `${flowId}/errors/${resourceId}`;
  const isFlowResource = useSelector(state => {
    // TODO @Raghu: Check for a suitable selector if existed or else create one
    const { pageGenerators: pgs = [], pageProcessors: pps = []} = selectors.resourceData(state, 'flows', flowId).merged || {};

    return pgs.some(pg => pg._exportId === resourceId) ||
      pps.some(pp => (pp._exportId || pp._importId) === resourceId);
  });

  if (numError > 0 && isFlowResource) {
    return <Link to={path} className={classes.errorLink}> {numError} </Link>;
  }

  return <span> {numError} </span>;
}
