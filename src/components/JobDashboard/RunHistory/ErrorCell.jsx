import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../../reducers';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { flowbuilderUrl } from '../../../utils/flows';
import { emptyObject } from '../../../constants';
import actions from '../../../actions';
import { getTextAfterCount } from '../../../utils/string';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import Status from '../../Buttons/Status';

export default function ErrorCell({ job, disabled }) {
  const { _integrationId, _flowId, _childId, _flowJobId, _parentJobId, _exportId, numOpenError, _importId, _expOrImpId } = job;
  const flowJobId = _flowJobId || _parentJobId;
  const dispatch = useDispatch();
  const id = _expOrImpId || _exportId || _importId;
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
    if (disabled) return;

    dispatch(actions.patchFilter(`${_flowId}-${flowJobId}-${id}`, {...job}));
    history.push(buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V2.JOB_ERROR_DETAILS,
      baseUrl: flowBuilderTo,
      params: { resourceId: id, flowJobId, errorType: 'open'},
    }));
  }, [disabled, dispatch, _flowId, flowJobId, id, job, history, flowBuilderTo]);

  if (!numOpenError) {
    return (
      <Status variant="success" size="mini" onClick={handleErrorClick}>Success</Status>
    );
  }

  return (
    <Status variant="error" size="mini" onClick={handleErrorClick}>
      {numOpenError > 9999 ? '9999+ errors' : getTextAfterCount('error', numOpenError)}
    </Status>
  );
}
