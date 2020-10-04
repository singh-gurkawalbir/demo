import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import RightDrawer from '../../../../components/drawer/Right';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import actions from '../../../../actions';
import CeligoTable from '../../../../components/CeligoTable';
import { flowbuilderUrl } from '../../../../utils/flows';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    color: theme.palette.primary.main,
    width: '100%',
    cursor: 'pointer',
    display: 'block',
  },
}));

const metadata = {
  columns: [
    {
      heading: 'Step',
      value: r => r.name,
    },

    {
      heading: 'Errors',
      value: function Errors({flowId, integrationId, childId, id, count}) {
        const classes = useStyles();
        const history = useHistory();
        const isDataLoader = useSelector(state =>
          selectors.isDataLoader(state, flowId)
        );
        const { merged: integration = {} } = useSelectorMemo(
          selectors.makeResourceDataSelector,
          'integrations',
          integrationId
        );
        const appName = useSelectorMemo(selectors.integrationAppName, integrationId);
        const flowBuilderTo = flowbuilderUrl(flowId, integrationId, {
          isIntegrationApp: !!integration._connectorId,
          childId,
          isDataLoader,
          appName,
        });

        const handleErrorClick = useCallback(() => {
          history.push(`${flowBuilderTo}/errors/${id}`);
        }, [flowBuilderTo, history, id]);

        if (count === 0) {
          return count;
        }

        return (
          <div className={classes.button} onClick={handleErrorClick}>{count}</div >
        );
      },
    },
  ],
};

const ErrorsList = ({integrationId, childId}) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();

  const { flowId } = match.params;
  const classes = useStyles();
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const { merged: flow = {} } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  );
  const flowResources = useSelectorMemo(selectors.mkflowResources, flowId);
  const errorMap = useSelector(state => selectors.errorMap(state, flowId)?.data) || {};

  const resources = useMemo(() => flowResources
    .filter(r => r._id !== flowId)
    .map(r => ({
      id: r._id,
      name: r.name || r._id,
      count: errorMap[r._id],
      flowId,
      childId,
      integrationId,
    })), [flowResources, flowId, errorMap, integrationId, childId]);

  useEffect(() => {
    if (!isUserInErrMgtTwoDotZero) return;

    dispatch(actions.errorManager.openFlowErrors.requestPoll({ flowId }));

    return () => {
      dispatch(actions.errorManager.openFlowErrors.cancelPoll());
    };
  }, [
    dispatch,
    flowId,
    isUserInErrMgtTwoDotZero,
  ]);

  if (!flow) {
    return <Typography>No flow exists with id: {flowId}</Typography>;
  }

  return (
    <div className={classes.root}>
      <CeligoTable data={resources} {...metadata} />
    </div>
  );
};

export default function ErrorsListDrawer({ integrationId, childId }) {
  return (
    <LoadResources
      required="true"
      resources="imports, exports, connections">
      <RightDrawer
        hideBackButton
        path={[
          ':flowId/errorsList',
        ]}
        height="tall"
        width="default"
        title="Flow step errors"
        variant="temporary"
      >

        <ErrorsList integrationId={integrationId} childId={childId} />
      </RightDrawer>
    </LoadResources>
  );
}
