import React, { useCallback, useEffect, useMemo } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
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
import getRoutePath from '../../../utils/routePaths';
import actions from '../../../actions';

const useStyles = makeStyles(theme => ({
  accordianWrapper: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  noAliases: {
    padding: theme.spacing(2),
  },
}));

const NO_ALIASES_MESSAGE = 'You don’t have any aliases.';

const ManageAliases = ({ flowId, accessLevel, isIntegrationApp, height }) => {
  const classes = useStyles();
  const resourceAliases = useSelectorMemo(selectors.makeOwnAliases, 'flows', flowId);
  const inheritedAliases = useSelectorMemo(selectors.makeInheritedAliases, flowId);
  const flow = useSelectorMemo(selectors.makeResourceSelector, 'flows', flowId);
  const actionProps = useMemo(() => ({
    isIntegrationApp,
    accessLevel,
    resourceType: 'flows',
    resourceId: flowId,
  }), [isIntegrationApp, accessLevel, flowId]);

  const aliasesTableData = useMemo(() => ([
    {
      data: resourceAliases.map(aliasData => ({...aliasData, _id: `${flowId}-${aliasData.alias}`})),
      title: 'Aliases',
      filterKey: `${flowId}+aliases`,
      actionProps: {...actionProps, hasManageAccess: true},
      noAliasesMessage: 'You don’t have any custom aliases.',
    },
    {
      data: inheritedAliases.map(aliasData => ({...aliasData, _id: `${flow._integrationId}-${aliasData.alias}`})),
      title: 'Inherited aliases',
      filterKey: `${flow._integrationId}+inheritedAliases`,
      actionProps,
      noAliasesMessage: 'You don’t have any inherited aliases.',
    },
  ]), [resourceAliases, inheritedAliases, flowId, flow, actionProps]);

  return (
    <>
      <CreateAliasDrawer resourceId={flowId} resourceType="flows" height={height} />
      <ViewAliasDetailsDrawer resourceId={flowId} resourceType="flows" height={height} />
      {aliasesTableData.map(tableData => (
        <div key={tableData.title} >
          <DynaCeligoTable
            className={classes.accordianWrapper}
            title={tableData.title}
            data={tableData.data}
            filterKey={tableData.filterKey}
            {...metadata}
            collapsable
            defaultExpand
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
  const filterKey = `${resourceId}+viewAliases`;
  const allAliases = useSelector(state => selectors.allAliases(state, resourceType, resourceId));
  const actionProps = useMemo(() => ({
    resourceType,
    resourceId,
  }), [resourceType, resourceId]);

  useEffect(() => {
    if (!allAliases) {
      dispatch(actions.resource.aliases.requestAll(resourceType, resourceId));
    }

    return () => (dispatch(actions.resource.aliases.clear(resourceId)));
  }, [dispatch, resourceId, resourceType, allAliases]);

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
      ) : (<Typography className={classes.noAliases}>{NO_ALIASES_MESSAGE}</Typography>)}
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

  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleCreateAliasDrawer = useCallback(() => {
    history.push(getRoutePath(`${match.url}/aliases/manage/add`));
  }, [history, match]);

  const infoTextManageAliases = 'Use this page to see all of your aliases for this flow, as well as any integration-level aliases (inherited aliases). You can create a new alias for this flow (top right), or use the Actions menu to edit, copy, delete, or view details for a flow-level alias.  Inherited aliases are passed down to the flow from the integration. However, keep in mind that if you reference both a flow-level alias and an integration-level alias for a resource in a script, the flow-level alias will take precedence. Use the Actions menu for Inherited aliases to copy an alias or view its details. To create, edit, or delete one of these aliases, navigate to the integration instead and use the Alias tab. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.';
  const infoTextViewAliases = 'View the list of aliases defined for your resources (flows, connections, export, and imports).';

  return (
    <RightDrawer
      variant="temporary"
      height={height}
      width="default"
      path={['aliases/manage', 'aliases/view']}
    >
      <Switch>
        <Route path={`${match.url}/aliases/manage`} >
          <DrawerHeader
            title="Manage Aliases"
            infoText={infoTextManageAliases}>
            {accessLevel !== 'monitor' ? (
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
            <ManageAliases flowId={resourceId} height={height} accessLevel={accessLevel} isIntegrationApp={isIntegrationApp} />
          </DrawerContent>
          <DrawerFooter>
            <FilledButton
              data-test="closeLogs"
              onClick={handleClose}>
              Close
            </FilledButton>
          </DrawerFooter>
        </Route>
        <Route path={`${match.url}/aliases/view`} >
          <DrawerHeader
            title="View Aliases"
            infoText={infoTextViewAliases} />
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
