import React, { useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import {
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@celigo/fuse-ui';
import RightDrawer from '../../Right';
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
      path={drawerPaths.INSTALL.TEMPLATE_PREVIEW}
      height="tall"
      width="large">
      <DrawerHeader>
        <DrawerTitle>Install template</DrawerTitle>
        <DrawerCloseButton onClick={handleClose} />
      </DrawerHeader>
      <DrawerContent>
        <Preview />
      </DrawerContent>
    </RightDrawer>
  );
}
