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
import { MANAGE_ALIASES_HELPINFO, VIEW_ALIASES_HELPINFO } from '../../../utils/messageStore';
import { NO_ALIASES_MESSAGE } from '../../../utils/errorStore';

const useStyles = makeStyles(theme => ({
  accordianWrapper: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  noAliases: {
    padding: theme.spacing(2),
  },
  manageAliases: {
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
  },
}));

const ManageAliases = ({ flowId, accessLevel, canUserPublish, height }) => {
  const classes = useStyles();
  const resourceAliases = useSelectorMemo(selectors.makeOwnAliases, 'flows', flowId);
  const inheritedAliases = useSelectorMemo(selectors.makeInheritedAliases, flowId);
  const flow = useSelectorMemo(selectors.makeResourceSelector, 'flows', flowId);
  const actionProps = useMemo(() => ({
    canUserPublish,
    accessLevel,
    resourceType: 'flows',
    resourceId: flowId,
  }), [canUserPublish, accessLevel, flowId]);

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
  const filterKey = `${resourceId}+viewAliases`;
  const allAliases = useSelector(state => selectors.allAliases(state, resourceId));
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
      ) : (<Typography className={classes.noAliases}>{NO_ALIASES_MESSAGE}</Typography>)}
    </>
  );
};

export default function AliasDrawerWrapper({ resourceId, resourceType, height = 'short' }) {
  const match = useRouteMatch();
  const history = useHistory();
  const resource = useSelectorMemo(selectors.makeResourceSelector, resourceType, resourceId);
  const integrationId = resourceType === 'integrations' ? resourceId : resource?._integrationId;
  const canUserPublish = useSelector(state => selectors.canUserPublish(state));
  const accessLevel = useSelector(
    state => selectors.resourcePermissions(state, 'integrations', integrationId).accessLevel
  );
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleCreateAliasDrawer = useCallback(() => {
    history.push(getRoutePath(`${match.url}/aliases/manage/add`));
  }, [history, match]);

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
            infoText={MANAGE_ALIASES_HELPINFO}>
            {accessLevel !== 'monitor' && canUserPublish ? (
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
            <ManageAliases flowId={resourceId} height={height} accessLevel={accessLevel} canUserPublish={canUserPublish} />
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
            infoText={VIEW_ALIASES_HELPINFO} />
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
