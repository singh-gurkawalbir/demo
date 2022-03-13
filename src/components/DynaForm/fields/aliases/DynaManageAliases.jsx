import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FormControl, FormLabel } from '@material-ui/core';
import OutlinedButton from '../../../Buttons/OutlinedButton';
import FieldHelp from '../../FieldHelp';
import AliasDrawerWrapper from '../../../drawer/Aliases';
import getRoutePath from '../../../../utils/routePaths';

export default function DynaManageAliases(props) {
  const { id, label, resourceContext } = props;
  const history = useHistory();
  const match = useRouteMatch();

  const helpText = 'Use this page to see all of your aliases for this flow, as well as any integration-level aliases (inherited aliases). You can create a new alias for this flow (top right), or use the Actions menu to edit, copy, delete, or view details for a flow-level alias.  Inherited aliases are passed down to the flow from the integration. However, keep in mind that if you reference both a flow-level alias and an integration-level alias for a resource in a script, the flow-level alias will take precedence. Use the Actions menu for Inherited aliases to copy an alias or view its details. To create, edit, or delete one of these aliases, navigate to the integration instead and use the Alias tab. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.';
  const handleDrawerClick = useCallback(() => {
    history.push(getRoutePath(`${match.url}/aliases/manage`));
  }, [history, match]);

  return (
    <>
      <AliasDrawerWrapper resourceId={resourceContext.resourceId} />
      <FormControl>
        <div>
          <FormLabel>
            {label}
          </FormLabel>
          <FieldHelp helpText={helpText} />
        </div>
        <OutlinedButton
          data-test={id}
          color="primary"
          onClick={handleDrawerClick}>
          Manage
        </OutlinedButton>
      </FormControl>
    </>
  );
}
