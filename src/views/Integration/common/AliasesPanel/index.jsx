import React, { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
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
import errorMessageStore from '../../../../utils/errorStore';
import messageStore from '../../../../utils/messageStore';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import actions from '../../../../actions';

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
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const isIntegrationV2 = useSelector(state =>
    isIntegrationAppVersion2(selectors.resource(state, 'integrations', integrationId), true)
  );
  const currentIntegrationId = isIntegrationV2 ? (childId || integrationId) : integrationId;
  const filterKey = `${currentIntegrationId}+aliases`;
  const isIntegrationApp = useSelector(state => selectors.isIntegrationApp(state, integrationId));
  const accessLevel = useSelector(state =>
    selectors.resourcePermissions(
      state,
      'integrations',
      currentIntegrationId,
    ).accessLevel
  );
  const hasManageAccess = accessLevel !== 'monitor' && !isIntegrationApp;
  const aliases = useSelector(state => {
    const tempAliases = selectors.ownAliases(state, 'integrations', currentIntegrationId);

    return tempAliases.map(aliasData => ({ ...aliasData, _id: aliasData.alias }));
  }, shallowEqual);
  const isAliasActionCompleted = useSelector(state => selectors.aliasActionStatus(state, currentIntegrationId));

  const handleClick = useCallback(() => {
    history.push(getRoutePath(`${match.url}/add`));
  }, [history, match]);

  const actionProps = useMemo(() => ({
    hasManageAccess,
    resourceType: 'integrations',
    resourceId: currentIntegrationId,
  }), [hasManageAccess, currentIntegrationId]);

  useEffect(() => {
    if (!isAliasActionCompleted) return;

    if (isAliasActionCompleted === 'delete') {
      enqueueSnackbar({ message: messageStore('ALIAS_DELETE_MESSAGE')});
    }

    if (isAliasActionCompleted === 'save') {
      enqueueSnackbar({ message: messageStore('ALIAS_SAVE_MESSAGE')});
    }

    dispatch(actions.resource.aliases.clear(currentIntegrationId));
  }, [isAliasActionCompleted, currentIntegrationId, enqueueSnackbar, dispatch]);

  return (
    <div className={classes.root}>
      <PanelHeader title="Aliases" infoText={messageStore('ALIAS_PANEL_HELPINFO')} className={classes.aliasesHeader} >
        <ActionGroup>
          {hasManageAccess && (
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
            data={aliases}
            filterKey={filterKey}
            {...metadata}
            actionProps={actionProps}
          />
          )
          : <Typography className={classes.noAliases}>{errorMessageStore('NO_ALIASES_MESSAGE')}</Typography>}
      </LoadResources>
    </div>
  );
}
