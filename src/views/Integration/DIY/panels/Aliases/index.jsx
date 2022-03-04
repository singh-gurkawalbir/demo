import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import PanelHeader from '../../../../../components/PanelHeader';
import ActionGroup from '../../../../../components/ActionGroup';
import { TextButton } from '../../../../../components/Buttons';
import LoadResources from '../../../../../components/LoadResources';
import CeligoTable from '../../../../../components/CeligoTable';
import metadata from '../../../../../components/ResourceTable/aliases/metadata';
import AddIcon from '../../../../../components/icons/AddIcon';
import { useSelectorMemo } from '../../../../../hooks';
import getRoutePath from '../../../../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
  },
  noAliases: {
    marginTop: theme.spacing(1),
  },
}));

export default function Aliases({ integrationId, childId }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const filterKey = `${childId || integrationId}+aliases`;
  const permission = useSelector(state =>
    selectors.resourcePermissions(
      state,
      'integrations',
      childId || integrationId,
    )
  );
  const aliases = useSelectorMemo(selectors.makeOwnAliases, 'integrations', childId || integrationId);
  const handleClick = useCallback(() => {
    history.push(getRoutePath(`${match.url}/aliases/add`));
  }, [history, match]);

  const infoTextAliases = 'An alias provides an easy way to reference a specific resource in your integration when you\'re building scripts. For example, instead of referring to a flow ID in a script, you can use an alias for that flow instead. This makes your script portable across environments and prevents you from having to manually change the referenced ID later. Use the Aliases tab to see all aliases that have been defined for this integration\'s flows, connections, imports, and exports. You can also create a new alias (top right), or use the Actions menu to edit, copy, delete, or view details for an alias. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.';
  const NO_ALIASES_MESSAGE = 'You don’t have any aliases.';

  return (
    <div className={classes.root}>
      <PanelHeader title="Aliases" infoText={infoTextAliases}>
        <ActionGroup>
          {permission.accessLevel !== 'monitor' && (
          <TextButton
            startIcon={<AddIcon />}
            onClick={handleClick}>
            Create alias
          </TextButton>
          )}
        </ActionGroup>
      </PanelHeader>

      {aliases?.length ? (
        <LoadResources required resources="integrations" >
          <CeligoTable
            data={aliases}
            filterKey={filterKey}
            {...metadata}
            actionProps={{ resourceType: 'integrations',
            }}
          />
        </LoadResources>
      )
        : <Typography className={classes.noAliases}>{NO_ALIASES_MESSAGE}</Typography>}
    </div>
  );
}
