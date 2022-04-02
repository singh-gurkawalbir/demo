import React, { useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import RightDrawer from '../../Right';
import DrawerHeader from '../../Right/DrawerHeader';
import DrawerContent from '../../Right/DrawerContent';
import Preview from './Preview';
import { drawerPaths } from '../../../../utils/rightDrawer';

export default function InstallTemplateDrawer() {
  const match = useRouteMatch();
  const history = useHistory();
  const handleClose = useCallback(() => {
    history.replace(match.url);
  }, [history, match.url]);

  return (
    <RightDrawer
      onClose={handleClose}
      path={drawerPaths.INSTALL.TEMPLATE_PREVIEW}
      height="tall"
      width="large">
      <DrawerHeader title="Install template" />
      <DrawerContent>
        <Preview />
      </DrawerContent>
    </RightDrawer>
  );
}
