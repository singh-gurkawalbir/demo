import React, { useCallback, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import PanelHeader from '../../../../components/PanelHeader';
import ActionGroup from '../../../../components/ActionGroup';
import { TextButton } from '../../../../components/Buttons';
import LoadResources from '../../../../components/LoadResources';
import CeligoTable from '../../../../components/CeligoTable';
import CreateAliasDrawer from '../../../../components/drawer/Aliases/CreateAliases';
import metadata from '../../../../components/ResourceTable/aliases/metadata';
import AddIcon from '../../../../components/icons/AddIcon';
import getRoutePath from '../../../../utils/routePaths';
import ViewAliasDetailsDrawer from '../../../../components/drawer/Aliases/ViewAliasesDetails';
import { isIntegrationAppVersion2 } from '../../../../utils/integrationApps';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 'calc(100vh - 300px)',
  },
  aliasesHeader: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  noAliases: {
    padding: theme.spacing(2),
  },
}));

export default function Aliases({ integrationId, childId }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const isIntegrationV2 = useSelector(state =>
    isIntegrationAppVersion2(selectors.resource(state, 'integrations', integrationId), true)
  );
  const currentIntegrationId = isIntegrationV2 ? (childId || integrationId) : integrationId;
  const filterKey = `${currentIntegrationId}+aliases`;
  const isIntegrationApp = useSelector(state => selectors.isIntegrationApp(state, currentIntegrationId));
  const accessLevel = useSelector(state =>
    selectors.resourcePermissions(
      state,
      'integrations',
      currentIntegrationId,
    ).accessLevel
  );
  const aliases = useSelector(state => selectors.ownAliases(state, 'integrations', currentIntegrationId));
  const handleClick = useCallback(() => {
    history.push(getRoutePath(`${match.url}/add`));
  }, [history, match]);

  const infoTextAliases = 'An alias provides an easy way to reference a specific resource in your integration when you\'re building scripts. For example, instead of referring to a flow ID in a script, you can use an alias for that flow instead. This makes your script portable across environments and prevents you from having to manually change the referenced ID later. Use the Aliases tab to see all aliases that have been defined for this integration\'s flows, connections, imports, and exports. You can also create a new alias (top right), or use the Actions menu to edit, copy, delete, or view details for an alias. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.';
  const NO_ALIASES_MESSAGE = 'You don’t have any aliases.';
  const actionProps = useMemo(() => ({
    isIntegrationApp,
    accessLevel,
    hasManageAccess: true,
    resourceType: 'integrations',
    resourceId: currentIntegrationId,
  }), [isIntegrationApp, accessLevel, currentIntegrationId]);

  return (
    <div className={classes.root}>
      <PanelHeader title="Aliases" infoText={infoTextAliases} className={classes.aliasesHeader} >
        <ActionGroup>
          {accessLevel !== 'monitor' && !isIntegrationApp && (
          <TextButton
            startIcon={<AddIcon />}
            onClick={handleClick}>
            Create alias
          </TextButton>
          )}
        </ActionGroup>
      </PanelHeader>

      <LoadResources required resources="integrations,flows,connections,imports,exports" >
        <CreateAliasDrawer resourceId={currentIntegrationId} resourceType="integrations" />
        <ViewAliasDetailsDrawer resourceId={currentIntegrationId} resourceType="integrations" />
        {aliases?.length ? (
          <CeligoTable
            data={aliases.map(aliasData => ({ ...aliasData, _id: aliasData.alias }))}
            filterKey={filterKey}
            {...metadata}
            actionProps={actionProps}
          />
          )
          : <Typography className={classes.noAliases}>{NO_ALIASES_MESSAGE}</Typography>}
      </LoadResources>
    </div>
  );
}
