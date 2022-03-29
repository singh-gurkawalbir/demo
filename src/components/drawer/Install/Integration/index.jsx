import React, { useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory, useLocation } from 'react-router-dom';
import RightDrawer from '../../Right';
import DrawerHeader from '../../Right/DrawerHeader';
import DrawerContent from '../../Right/DrawerContent';
import UploadFile from './UploadFile';
import Preview from './Preview';
import { DRAWER_URLS, DRAWER_URL_PREFIX } from '../../../../utils/drawerURLs';

export default function InstallIntegrationDrawer() {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const handleClose = useCallback(() => {
    history.replace(match.url);
  }, [history, match.url]);

  return (
    <RightDrawer
      onClose={handleClose}
      path={DRAWER_URLS.INSTALL_INTEGRATION}
      height="tall">
      <DrawerHeader title="Install integration" showBackButton={location.pathname.includes('/preview')} />
      <DrawerContent>
        <Switch>
          <Route
            path={`${match.url}/${DRAWER_URLS.INSTALL_INTEGRATION}/${DRAWER_URL_PREFIX}/preview/:templateId`}
          >
            <Preview />
          </Route>
          <Route path={`${match.url}/${DRAWER_URLS.INSTALL_INTEGRATION}`}>
            <UploadFile />
          </Route>
        </Switch>
      </DrawerContent>
    </RightDrawer>
  );
}
