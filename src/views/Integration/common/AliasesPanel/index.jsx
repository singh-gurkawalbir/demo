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
import { NO_ALIASES_MESSAGE } from '../../../../utils/errorStore';
import { ALIAS_PANEL_HELPINFO } from '../../../../utils/messageStore';

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
  const accessLevel = useSelector(state =>
    selectors.resourcePermissions(
      state,
      'integrations',
      currentIntegrationId,
    ).accessLevel
  );
  const canUserPublish = useSelector(state => selectors.canUserPublish(state));
  const aliases = useSelector(state => selectors.ownAliases(state, 'integrations', currentIntegrationId));
  const handleClick = useCallback(() => {
    history.push(getRoutePath(`${match.url}/add`));
  }, [history, match]);

  const actionProps = useMemo(() => ({
    canUserPublish,
    accessLevel,
    hasManageAccess: true,
    resourceType: 'integrations',
    resourceId: currentIntegrationId,
  }), [canUserPublish, accessLevel, currentIntegrationId]);

  return (
    <div className={classes.root}>
      <PanelHeader title="Aliases" infoText={ALIAS_PANEL_HELPINFO} className={classes.aliasesHeader} >
        <ActionGroup>
          {accessLevel !== 'monitor' && canUserPublish && (
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
