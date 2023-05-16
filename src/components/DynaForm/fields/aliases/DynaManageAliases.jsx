import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { FormControl, FormLabel } from '@mui/material';
import { OutlinedButton } from '@celigo/fuse-ui';
import FieldHelp from '../../FieldHelp';
import AliasDrawerWrapper from '../../../drawer/Aliases';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';

export default function DynaManageAliases({ id, label, resourceContext, ...props}) {
  const history = useHistory();
  const match = useRouteMatch();

  const handleDrawerClick = useCallback(() => {
    history.push(buildDrawerUrl({
      path: drawerPaths.ALIASES.MANAGE,
      baseUrl: match.url,
    }));
  }, [history, match]);

  return (
    <>
      <AliasDrawerWrapper resourceType={resourceContext.resourceType} resourceId={resourceContext.resourceId} />
      <FormControl variant="standard">
        <div>
          <FormLabel>
            {label}
          </FormLabel>
          <FieldHelp label={label} {...props} />
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
