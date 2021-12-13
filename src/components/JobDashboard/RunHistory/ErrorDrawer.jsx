import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../reducers';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { flowbuilderUrl } from '../../../utils/flows';
import { emptyObject } from '../../../utils/constants';
import StatusCircle from '../../StatusCircle';
import actions from '../../../actions';

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.palette.primary.main,
    width: '100%',
    cursor: 'pointer',
    display: 'block',
  },
}));
export default function ErrorDrawer({
  job,
  parentJob,
}) {
  const { _integrationId, _flowId, _childId, _id } = parentJob;
  const { _exportId, numOpenError, _importId } = job;
  const dispatch = useDispatch();
  const id = _exportId || _importId;
  const classes = useStyles();
  const history = useHistory();
  const isDataLoader = useSelector(state =>
    selectors.isDataLoader(state, _flowId)
  );
  const integration = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'integrations',
    _integrationId
  )?.merged || emptyObject;
  const appName = useSelectorMemo(selectors.integrationAppName, _integrationId);
  const flowBuilderTo = flowbuilderUrl(_flowId, _integrationId, {
    isIntegrationApp: !!integration._connectorId,
    _childId,
    isDataLoader,
    appName,
  });

  const handleErrorClick = useCallback(() => {
    dispatch(actions.patchFilter(`${_flowId}-${_id}-${id}`, {...job}));
    history.push(`${flowBuilderTo}/errors/${id}/filter/${_id}`);
  }, [_flowId, _id, dispatch, flowBuilderTo, history, id, job]);

  if (numOpenError === 0) {
    return '0';
  }

  return (
    <div className={classes.button} onClick={handleErrorClick}>
      <StatusCircle variant="error" size="mini" />
      {numOpenError > 9999 ? '9999+' : numOpenError} errors
    </div >
  );
}
