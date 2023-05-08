import React, { useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import {
  DrawerBackButton,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@celigo/fuse-ui';
import RightDrawer from '../../Right';
import UploadFile from './UploadFile';
import Preview from './Preview';
import { drawerPaths, buildDrawerUrl } from '../../../../utils/rightDrawer';

export default function InstallIntegrationDrawer() {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const handleClose = useCallback(() => {
    history.replace(match.url);
  }, [history, match.url]);
  const installIntegrationPath = buildDrawerUrl({
    path: drawerPaths.INSTALL.INTEGRATION,
    baseUrl: match.url,
  });
  const showBackButton = !!location.pathname.includes('/preview');
  const handleBackClick = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <RightDrawer
      path={drawerPaths.INSTALL.INTEGRATION}
      height="tall">
      <DrawerHeader>
        {showBackButton && <DrawerBackButton onClick={handleBackClick} />}
        <DrawerTitle>Upload integration</DrawerTitle>
        <DrawerCloseButton onClick={handleClose} />
      </DrawerHeader>
      <DrawerContent withPadding>
        <Switch>
          <Route
            path={buildDrawerUrl({
              path: drawerPaths.INSTALL.INTEGRATION_PREVIEW,
              baseUrl: installIntegrationPath,
            })}>
            <Preview />
          </Route>
          <Route path={installIntegrationPath}>
            <UploadFile />
          </Route>
        </Switch>
      </DrawerContent>
    </RightDrawer>
  );
}
