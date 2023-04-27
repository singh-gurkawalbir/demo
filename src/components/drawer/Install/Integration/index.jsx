import React, { useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import RightDrawer from '../../Right';
import DrawerHeader from '../../Right/DrawerHeader';
import DrawerContent from '../../Right/DrawerContent';
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

  return (
    <RightDrawer
      onClose={handleClose}
      path={drawerPaths.INSTALL.INTEGRATION}
      height="tall">
      <DrawerHeader title="Upload integration" showBackButton={location.pathname.includes('/preview')} />
      <DrawerContent>
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
