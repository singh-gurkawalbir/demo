import React, { useCallback } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { useSelectorMemo } from '../../../../../hooks';
import { selectors } from '../../../../../reducers';
import FilledButton from '../../../../Buttons/FilledButton';
import TextButton from '../../../../Buttons/TextButton';
import RightDrawer from '../../../../drawer/Right';
import DrawerFooter from '../../../../drawer/Right/DrawerFooter';
import DrawerHeader from '../../../../drawer/Right/DrawerHeader';
import AddIcon from '../../../../icons/AddIcon';
import metadata from '../../../../ResourceTable/aliases/metadata';
import DynaCeligoTable from '../../DynaCeligoTable';
import CeligoTable from '../../../../CeligoTable';

const useStyles = makeStyles(theme => ({
  accordianWrapper: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  noAliases: {
    marginTop: theme.spacing(1),
  },
}));

const ManageAliases = ({ flowId }) => {
  const classes = useStyles();
  const resourceAliases = useSelectorMemo(selectors.makeOwnAliases, 'flows', flowId);
  const inheritedAliases = useSelectorMemo(selectors.makeInheritedAliases, 'flows', flowId);

  const aliasesTableData = [
    {
      data: resourceAliases,
      title: 'Aliases',
      filterKey: `${flowId}+aliases`,
    },
    {
      data: inheritedAliases,
      title: 'Inherited aliases',
      filterKey: `${flowId}+inheritedAliases`,
    },
  ];

  return (
    <>
      {aliasesTableData.map(alias => (
        <>
          <DynaCeligoTable
            className={classes.accordianWrapper}
            title={alias.title}
            data={alias.data}
            filterKey={alias.filterKey}
            {...metadata}
            collapsable
            defaultExpand
            actionProps={{ resourceType: 'integrations' }}
          />
        </>
      ))}
    </>
  );
};

const ViewAliases = ({ flowId }) => {
  const classes = useStyles();
  const filterKey = `${flowId}+viewAliases`;
  const allAliases = useSelectorMemo(selectors.makeAllAliases, 'flows', flowId);

  return (
    <CeligoTable
      className={classes.accordianWrapper}
      data={allAliases}
      filterKey={filterKey}
      {...metadata}
      actionProps={{ resourceType: 'integrations' }}
    />
  );
};

export default function AliasDrawerWrapper({ resourceId, parentUrl }) {
  const match = useRouteMatch();
  const history = useHistory();

  const handleClose = useCallback(() => {
    history.replace(parentUrl);
  }, [history, parentUrl]);

  const handleCreateAliasDrawer = useCallback(() => {
    history.replace(`${match.url}/add`);
  }, [history, match]);

  const infoTextManageAliases = 'Use this page to see all of your aliases for this flow, as well as any integration-level aliases (inherited aliases). You can create a new alias for this flow (top right), or use the Actions menu to edit, copy, delete, or view details for a flow-level alias.  Inherited aliases are passed down to the flow from the integration. However, keep in mind that if you reference both a flow-level alias and an integration-level alias for a resource in a script, the flow-level alias will take precedence. Use the Actions menu for Inherited aliases to copy an alias or view its details. To create, edit, or delete one of these aliases, navigate to the integration instead and use the Alias tab. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.';
  const infoTextViewAliases = 'View the list of aliases defined for your resources (flows, connections, export, and imports).';

  return (
    <RightDrawer
      height="tall"
      width="default"
      path={['aliases/manage', 'aliases/view']}
    >
      <Switch>
        <Route path={`${match.url}/aliases/manage`} >
          <DrawerHeader
            title="Manage Aliases"
            infoText={infoTextManageAliases}
            handleClose={handleClose}>
            <TextButton
              startIcon={<AddIcon />}
              onClick={handleCreateAliasDrawer}>
              Create alias
            </TextButton>
          </DrawerHeader>
          <ManageAliases flowId={resourceId} />
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
            infoText={infoTextViewAliases}
            handleClose={handleClose} />
          <ViewAliases />
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
