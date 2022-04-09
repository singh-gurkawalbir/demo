import React, { useCallback, useEffect, useMemo } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useSelectorMemo } from '../../../hooks';
import { selectors } from '../../../reducers';
import FilledButton from '../../Buttons/FilledButton';
import TextButton from '../../Buttons/TextButton';
import RightDrawer from '../Right';
import DrawerFooter from '../Right/DrawerFooter';
import DrawerHeader from '../Right/DrawerHeader';
import AddIcon from '../../icons/AddIcon';
import metadata from '../../ResourceTable/aliases/metadata';
import DynaCeligoTable from '../../DynaForm/fields/DynaCeligoTable';
import CeligoTable from '../../CeligoTable';
import CreateAliasDrawer from './CreateAliases';
import DrawerContent from '../Right/DrawerContent';
import CeligoDivider from '../../CeligoDivider';
import ViewAliasDetailsDrawer from './ViewAliasesDetails';
import actions from '../../../actions';
import messageStore from '../../../utils/messageStore';
import errorMessageStore from '../../../utils/errorStore';
import { drawerPaths, buildDrawerUrl } from '../../../utils/rightDrawer';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import NoResultTypography from '../../NoResultTypography';

const useStyles = makeStyles(theme => ({
  accordianWrapper: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  manageAliases: {
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
  },
}));

const ManageAliases = ({ flowId, hasManageAccess, height }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const aliasesFilterKey = `${flowId}-aliases`;
  const inheritedAliasesFilterKey = `${flowId}-inheritedAliases`;
  const flow = useSelectorMemo(selectors.makeResourceSelector, 'flows', flowId);
  const resourceAliases = useSelector(state => selectors.ownAliases(state, 'flows', flowId, aliasesFilterKey));
  const inheritedAliases = useSelector(state => selectors.inheritedAliases(state, flowId, inheritedAliasesFilterKey));
  const isAliasActionCompleted = useSelector(state => selectors.aliasActionStatus(state, flowId));
  const actionProps = useMemo(() => ({
    resourceType: 'flows',
    resourceId: flowId,
  }), [flowId]);

  const aliasesTableData = useMemo(() => ([
    {
      data: resourceAliases.map(aliasData => ({...aliasData, _id: `${flowId}-${aliasData.alias}`})),
      title: 'Aliases',
      filterKey: aliasesFilterKey,
      actionProps: {...actionProps, hasManageAccess},
      noAliasesMessage: errorMessageStore('NO_CUSTOM_ALIASES_MESSAGE'),
    },
    {
      data: inheritedAliases.map(aliasData => ({...aliasData, _id: `${flow._integrationId}-${aliasData.alias}`})),
      title: 'Inherited aliases',
      filterKey: inheritedAliasesFilterKey,
      actionProps,
      noAliasesMessage: errorMessageStore('NO_INHERITED_ALIASES_MESSAGE'),
    },
  ]), [resourceAliases, inheritedAliases, flowId, flow, aliasesFilterKey, inheritedAliasesFilterKey, actionProps, hasManageAccess]);

  useEffect(() => {
    if (!isAliasActionCompleted) return;

    if (isAliasActionCompleted === 'delete') {
      enqueueSnackbar({ message: messageStore('ALIAS_DELETE_MESSAGE')});
    }

    if (isAliasActionCompleted === 'save') {
      enqueueSnackbar({ message: messageStore('ALIAS_SAVE_MESSAGE')});
    }

    dispatch(actions.resource.aliases.clear(flowId));
  }, [isAliasActionCompleted, flowId, enqueueSnackbar, dispatch]);

  return (
    <>
      <CreateAliasDrawer resourceId={flowId} resourceType="flows" height={height} />
      <ViewAliasDetailsDrawer resourceId={flowId} resourceType="flows" height={height} />
      {aliasesTableData.map(tableData => (
        <div key={tableData.title} className={classes.manageAliases}>
          <DynaCeligoTable
            className={classes.accordianWrapper}
            title={tableData.title}
            data={tableData.data}
            filterKey={tableData.filterKey}
            {...metadata}
            collapsable
            defaultExpand
            isTitleBold
            actionProps={tableData.actionProps}
            noDataMessage={tableData.noAliasesMessage}
          />
        </div>
      ))}
    </>
  );
};

const ViewAliases = ({ resourceId, resourceType, height }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filterKey = `${resourceId}-viewAliases`;
  const allAliases = useSelector(state => selectors.allAliases(state, resourceId, filterKey));
  const actionProps = useMemo(() => ({
    resourceType,
    resourceId,
  }), [resourceType, resourceId]);

  useEffect(() => {
    if (!allAliases.length) {
      dispatch(actions.resource.aliases.requestAll(resourceId, resourceType));
    }

    return () => (dispatch(actions.resource.aliases.clear(resourceId)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ViewAliasDetailsDrawer resourceId={resourceId} resourceType={resourceType} height={height} />
      {allAliases.length ? (
        <CeligoTable
          className={classes.accordianWrapper}
          data={allAliases}
          filterKey={filterKey}
          {...metadata}
          actionProps={actionProps}
        />
      ) : (<NoResultTypography>{errorMessageStore('NO_ALIASES_MESSAGE')}</NoResultTypography>)}
    </>
  );
};

export default function AliasDrawerWrapper({ resourceId, resourceType, height = 'short' }) {
  const match = useRouteMatch();
  const history = useHistory();
  const resource = useSelectorMemo(selectors.makeResourceSelector, resourceType, resourceId);
  const integrationId = resourceType === 'integrations' ? resourceId : resource?._integrationId;
  const isIntegrationApp = useSelector(state => selectors.isIntegrationApp(state, integrationId));
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state, 'integrations', integrationId).accessLevel
  );
  const hasManageAccess = accessLevel !== 'monitor' && !isIntegrationApp;
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const manageAliasesDrawerUrl = buildDrawerUrl({
    path: drawerPaths.ALIASES.MANAGE,
    baseUrl: match.url,
  });
  const viewAliasesDrawerUrl = buildDrawerUrl({
    path: drawerPaths.ALIASES.VIEW,
    baseUrl: match.url,
  });
  const handleCreateAliasDrawer = useCallback(() => {
    history.push(buildDrawerUrl({
      path: drawerPaths.ALIASES.ADD,
      baseUrl: manageAliasesDrawerUrl,
    }));
  }, [history, manageAliasesDrawerUrl]);

  return (
    <RightDrawer
      height={height}
      width="default"
      path={[drawerPaths.ALIASES.MANAGE, drawerPaths.ALIASES.VIEW]} >
      <Switch>
        <Route path={manageAliasesDrawerUrl} >
          <DrawerHeader
            title="Manage Aliases"
            infoText={messageStore('MANAGE_ALIASES_HELPINFO')}>
            {hasManageAccess ? (
              <>
                <TextButton
                  startIcon={<AddIcon />}
                  onClick={handleCreateAliasDrawer}>
                  Create alias
                </TextButton>
                <CeligoDivider position="right" />
              </>
            ) : ''}
          </DrawerHeader>
          <DrawerContent>
            <ManageAliases flowId={resourceId} height={height} hasManageAccess={hasManageAccess} />
          </DrawerContent>
          <DrawerFooter>
            <FilledButton
              data-test="closeLogs"
              onClick={handleClose}>
              Close
            </FilledButton>
          </DrawerFooter>
        </Route>
        <Route path={viewAliasesDrawerUrl} >
          <DrawerHeader
            title="View Aliases"
            infoText={messageStore('VIEW_ALIASES_HELPINFO')} />
          <DrawerContent>
            <ViewAliases resourceId={resourceId} resourceType={resourceType} height={height} />
          </DrawerContent>
          <DrawerFooter>
            <FilledButton
              data-test="closeLogs"
              onClick={handleClose}>
              Close
            </FilledButton>
          </DrawerFooter>
        </Route>
      </Switch>
    </RightDrawer>
  );
}
