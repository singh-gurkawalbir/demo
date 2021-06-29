import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useHistory, useLocation, matchPath, useRouteMatch } from 'react-router-dom';
import { isNewFlowFn, usePatchNewFlow } from '../hooks';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { generateNewId, isNewId } from '../../../utils/resource';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

export default function Redirection({children}) {
  const match = useRouteMatch();
  const { flowId, integrationId } = match.params;
  const dispatch = useDispatch();
  const history = useHistory();
  const newFlowId = useSelector(state =>
    selectors.createdResourceId(state, flowId)
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  )?.merged;
  const environment = useSelector(
    state => selectors.userPreferences(state).environment
  );

  if (flow && !isNewId(flowId) && !flow.sandbox === (environment === 'sandbox')) {
    dispatch(actions.user.preferences.update({ environment: flow?.sandbox ? 'sandbox' : 'production' }));
  }
  const location = useLocation();
  const rewriteUrl = useCallback(
    id => {
      const parts = match.url.split('/');

      parts[parts.length - 1] = id;

      return parts.join('/');
    },
    [match.url]
  );

  const patchNewFlow = usePatchNewFlow(integrationId);

  useEffect(() => {
    if (!isUserInErrMgtTwoDotZero || isNewFlowFn(flowId)) return;

    dispatch(actions.errorManager.openFlowErrors.requestPoll({ flowId }));

    return () => {
      dispatch(actions.errorManager.openFlowErrors.cancelPoll());
      dispatch(actions.errorManager.latestFlowJobs.clear({ flowId }));
    };
  }, [dispatch, flowId, isUserInErrMgtTwoDotZero]);

  useEffect(() => {
    // NEW DATA LOADER REDIRECTION
    if (isNewId(flowId)) {
      if (match.url.toLowerCase().includes('dataloader')) {
        patchNewFlow(flowId, 'New data loader flow', {
          application: 'dataLoader',
        });
      } else {
        patchNewFlow(flowId);
      }
    }

    return () => {
      dispatch(actions.resource.clearStaged(flowId, 'values'));
    };
  }, [dispatch, flowId, match.url, patchNewFlow]);

  // NEW FLOW REDIRECTION
  if (flowId === 'new') {
    const tempId = generateNewId();

    history.replace(rewriteUrl(tempId));

    return null;
  }

  // Replaces the url once the virtual flow resource is
  // persisted and we have the final flow id.
  if (newFlowId) {
    const nestedPgOrPpPath = matchPath(location.pathname, {
      path: `${match.path}/:mode/:resourceType/:resourceId`,
    });

    if (nestedPgOrPpPath && nestedPgOrPpPath.isExact) {
      // Incase of a pg or pp opened ... replace url flowId with newFlowId
      // @BugFix: IO-16074
      history.replace(generatePath(nestedPgOrPpPath.path, {
        ...nestedPgOrPpPath.params,
        flowId: newFlowId,
      }));
    } else {
      // In all other cases go back to flow url with new FlowId
      history.replace(rewriteUrl(newFlowId));
    }

    return null;
  }

  return children;
}
