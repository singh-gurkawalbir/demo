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
import { getTextAfterCount } from '../../../utils/string';
import Status from '../../Buttons/Status';
import TextButton from '../../Buttons/TextButton';

const useStyles = makeStyles(theme => ({
  errorButtonContainer: {
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.light,
      background: 'none',
    },
    '& > * .MuiButton-startIcon': {
      marginRight: 0,
    },
  },
}));
export default function ErrorCell({
  job,
}) {
  const { _integrationId, _flowId, _childId, _flowJobId, _exportId, numOpenError, _importId } = job;
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
    dispatch(actions.patchFilter(`${_flowId}-${_flowJobId}-${id}`, {...job}));
    history.push(`${flowBuilderTo}/errors/${id}/filter/${_flowJobId}/open`);
  }, [_flowId, _flowJobId, dispatch, flowBuilderTo, history, id, job]);

  if (!numOpenError) {
    return (
      <Status variant="success" size="mini" onClick={handleErrorClick}>Success</Status>
    );
  }

  return (
    <TextButton
      className={classes.errorButtonContainer}
      onClick={handleErrorClick}
      startIcon={<StatusCircle variant="error" size="mini" />}>
      {numOpenError > 9999 ? '9999+ errors' : getTextAfterCount('error', numOpenError)}
    </TextButton>
  );
}
