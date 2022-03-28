import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FormControl, FormLabel } from '@material-ui/core';
import OutlinedButton from '../../../Buttons/OutlinedButton';
import FieldHelp from '../../FieldHelp';
import AliasDrawerWrapper from '../../../drawer/Aliases';
import getRoutePath from '../../../../utils/routePaths';

export default function DynaManageAliases({ id, label, resourceContext, ...props}) {
  const history = useHistory();
  const match = useRouteMatch();

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
          <FieldHelp {...props} />
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
