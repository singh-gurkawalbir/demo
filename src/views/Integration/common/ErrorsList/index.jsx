import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory, matchPath, useLocation } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import RightDrawer from '../../../../components/drawer/Right';
import DrawerHeader from '../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../components/drawer/Right/DrawerContent';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import actions from '../../../../actions';
import CeligoTable from '../../../../components/CeligoTable';
import { flowbuilderUrl } from '../../../../utils/flows';
import Spinner from '../../../../components/Spinner';
import ApplicationImg from '../../../../components/icons/ApplicationImg';
import { resourceCategory } from '../../../../utils/resource';
import TextOverflowCell from '../../../../components/TextOverflowCell';
import ResourceButton from '../../../FlowBuilder/ResourceButton';
import { emptyObject } from '../../../../utils/constants';
import StatusCircle from '../../../../components/StatusCircle';
import CeligoTimeAgo from '../../../../components/CeligoTimeAgo';
import { getTextAfterCount } from '../../../../utils/string';

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.palette.primary.main,
    width: '100%',
    cursor: 'pointer',
    display: 'block',
  },
}));

const metadata = {
  rowKey: 'id',
  useColumns: () => [
    {
      key: 'application',
      heading: 'Application',
      isLoggable: true,
      Value: ({rowData}) => {
        const { type, id } = rowData;
        const applicationType = useSelector(state => selectors.applicationType(state, type, id));
        const isDataLoader = useSelector(state => selectors.isDataLoaderExport(state, id));
        const assistantType = useSelector(state => {
          const { _connectionId} = selectors.resource(state, type, id) || {};
          const {assistant} = selectors.resource(state, 'connections', _connectionId) || {};

          return assistant || '';
        });

        if (isDataLoader) {
          return 'Data loader';
        }

        return (
          <ApplicationImg
            type={applicationType}
            assistant={assistantType}
      />
        );
      },
    },
    {
      key: 'type',
      heading: 'Type',
      isLoggable: true,
      Value: ({rowData}) => {
        const { type, id, isLookup } = rowData;
        const { merged: doc } = useSelectorMemo(selectors.makeResourceDataSelector, type, id);
        const category = resourceCategory(doc, isLookup, type === 'imports');
        const handleClick = useCallback(() => {}, []);

        return (
          <ResourceButton
            onClick={handleClick}
            variant={category}
      />
        );
      },
    },
    {
      key: 'flowStepName',
      heading: 'Flow step name',
      width: '25%',
      isLoggable: true,
      Value: ({rowData: r}) => <TextOverflowCell message={r.name} />,
    },
    {
      key: 'errors',
      heading: 'Errors',
      isLoggable: true,
      Value: ({rowData}) => {
        const { flowId, integrationId, childId, id, count } = rowData;
        const classes = useStyles();
        const history = useHistory();
        const isDataLoader = useSelector(state =>
          selectors.isDataLoader(state, flowId)
        );
        const integration = useSelectorMemo(
          selectors.makeResourceDataSelector,
          'integrations',
          integrationId
        )?.merged || emptyObject;
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

        if (!count) {
          return (
            <div className={classes.button} onClick={handleErrorClick}>
              <StatusCircle variant="success" size="mini" />
              success
            </div >
          );
        }

        return (
          <div className={classes.button} onClick={handleErrorClick}>
            <StatusCircle variant="error" size="mini" />
            {count > 9999 ? '9999+ errors' : getTextAfterCount('error', count)}
          </div >
        );
      },
    },
    {
      key: 'lastErrorAt',
      heading: 'Last open error',
      isLoggable: true,
      Value: ({ rowData }) => <CeligoTimeAgo date={rowData.lastErrorAt} />,
      orderBy: 'lastErrorAt',
    },
  ],
};

const FILTER_KEY = 'errorsList';

const ErrorsList = ({integrationId, childId}) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { flowId } = match.params;
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  )?.merged || emptyObject;
  const resources = useSelectorMemo(selectors.mkFlowStepsErrorInfo, flowId, integrationId, childId, FILTER_KEY);
  const status = useSelector(state => selectors.openErrorsStatus(state, flowId));

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
  if (status !== 'received') {
    return <Spinner centerAll />;
  }

  return (
    <CeligoTable data={resources} filterKey={FILTER_KEY} {...metadata} />
  );
};

export default function ErrorsListDrawer({ integrationId, childId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const { params: { flowId } = {} } = matchPath(location.pathname, {path: `${match.path}/:flowId/errorsList`}) || {};
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  )?.merged || emptyObject;
  const handleClose = useCallback(() => {
    history.push(match.url);
  }, [match.url, history]);

  return (
    <LoadResources
      required="true"
      resources="imports, exports, connections">
      <RightDrawer
        path=":flowId/errorsList"
        height="tall"
        onClose={handleClose}
        variant="temporary">

        <DrawerHeader title={`Flow: ${flow.name || flowId}`} />

        <DrawerContent>
          <ErrorsList integrationId={integrationId || flow._integrationId} childId={childId} />
        </DrawerContent>
      </RightDrawer>
    </LoadResources>
  );
}
