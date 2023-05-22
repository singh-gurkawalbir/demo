import React, { useCallback, useEffect, useMemo } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import {
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  InfoIconButton,
  FilledButton,
  TextButton,
} from '@celigo/fuse-ui';
import { useSelectorMemo } from '../../../hooks';
import { selectors } from '../../../reducers';
import RightDrawer from '../Right';
import AddIcon from '../../icons/AddIcon';
import metadata from '../../ResourceTable/aliases/metadata';
import DynaCeligoTable from '../../DynaForm/fields/DynaCeligoTable';
import CeligoTable from '../../CeligoTable';
import CreateAliasDrawer from './CreateAliases';
import CeligoDivider from '../../CeligoDivider';
import ViewAliasDetailsDrawer from './ViewAliasesDetails';
import actions from '../../../actions';
import { message } from '../../../utils/messageStore';
import { drawerPaths, buildDrawerUrl } from '../../../utils/rightDrawer';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import NoResultTypography from '../../NoResultTypography';
import LoadResources from '../../LoadResources';
import customCloneDeep from '../../../utils/customCloneDeep';

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
  const tempResourceAliases = useSelector(state => selectors.ownAliases(state, 'flows', flowId, aliasesFilterKey));
  const resourceAliases = useMemo(() => customCloneDeep(tempResourceAliases), [tempResourceAliases]);
  const tempInheritedAliases = useSelector(state => selectors.inheritedAliases(state, flowId, inheritedAliasesFilterKey));
  const inheritedAliases = useMemo(() => customCloneDeep(tempInheritedAliases), [tempInheritedAliases]);
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
      noAliasesMessage: message.ALIAS.NO_CUSTOM_ALIASES_MESSAGE,
    },
    {
      data: inheritedAliases.map(aliasData => ({...aliasData, _id: `${flow._integrationId}-${aliasData.alias}`})),
      title: 'Inherited aliases',
      filterKey: inheritedAliasesFilterKey,
      actionProps,
      noAliasesMessage: message.ALIAS.NO_INHERITED_ALIASES_MESSAGE,
    },
  ]), [resourceAliases, inheritedAliases, flowId, flow, aliasesFilterKey, inheritedAliasesFilterKey, actionProps, hasManageAccess]);

  useEffect(() => {
    if (!isAliasActionCompleted) return;

    if (isAliasActionCompleted === 'delete') {
      enqueueSnackbar({ message: message.ALIAS.DELETE_MESSAGE});
    }

    if (isAliasActionCompleted === 'save') {
      enqueueSnackbar({ message: message.ALIAS.SAVE_MESSAGE});
    }

    dispatch(actions.resource.aliases.clear(flowId));
  }, [isAliasActionCompleted, flowId, enqueueSnackbar, dispatch]);

  return (
    <LoadResources required resources="flows,connections,imports,exports" >
      <CreateAliasDrawer resourceId={flowId} resourceType="flows" height={height} />
      <ViewAliasDetailsDrawer resourceId={flowId} resourceType="flows" height={height} />
      {aliasesTableData.map(tableData => (
        <div key={tableData.title} className={classes.manageAliases}>
          <DynaCeligoTable
            className={classes.accordianWrapper}
            title={tableData.title}
            data={customCloneDeep(tableData.data)}
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
    </LoadResources>
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
    <LoadResources required resources="flows,connections,imports,exports" >
      <ViewAliasDetailsDrawer resourceId={resourceId} resourceType={resourceType} height={height} />
      {allAliases.length ? (
        <CeligoTable
          className={classes.accordianWrapper}
          data={customCloneDeep(allAliases)}
          filterKey={filterKey}
          {...metadata}
          actionProps={actionProps}
        />
      ) : (<NoResultTypography>{message.ALIAS.NO_ALIASES_MESSAGE}</NoResultTypography>)}
    </LoadResources>
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
      isIntegrated
      height={height}
      path={[drawerPaths.ALIASES.MANAGE, drawerPaths.ALIASES.VIEW]} >
      <Switch>
        <Route path={manageAliasesDrawerUrl} >
          <DrawerHeader>
            <DrawerTitle>
              Manage aliases
              <InfoIconButton
                info={message.ALIAS.MANAGE_ALIASES_HELPINFO}
                title="Manage aliases"
              />
            </DrawerTitle>
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
            <DrawerCloseButton onClick={handleClose} />
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
          <DrawerHeader>
            <DrawerTitle>
              View aliases
              <InfoIconButton
                info={message.ALIAS.VIEW_ALIASES_HELPINFO}
                title="View aliases"
              />
            </DrawerTitle>
            <DrawerCloseButton onClick={handleClose} />
          </DrawerHeader>
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
