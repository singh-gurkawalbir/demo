import React, { useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import RightDrawer from '../../Right/V2';
import DrawerHeader from '../../Right/V2/DrawerHeader';
import DrawerContent from '../../Right/V2/DrawerContent';
import UploadFile from './UploadFile';
import Preview from './Preview';
import Setup from '../common/Setup';

const rootPath = 'installIntegration';

export default function InstallIntegrationDrawer() {
  const match = useRouteMatch();
  const history = useHistory();
  const handleClose = useCallback(() => {
    // we don't know if there were other history events, so we cant just do history.goBack.
    // we can however just remove all segments of the url including and AFTER the rootPath of the drawer.
    const newUrl = match.url.split(rootPath)[0];

    history.push(newUrl);
  }, [history, match.url]);

  return (
    <RightDrawer
      onClose={handleClose}
      path={rootPath}
      height="tall">

      <DrawerHeader title="Install integration" />

      <DrawerContent>
        <Switch>
          <Route path={`${match.url}/${rootPath}/preview/:templateId`}>
            <Preview />
          </Route>
          <Route path={`${match.url}/${rootPath}/setup/:templateId`}>
            <Setup handleClose={handleClose} />
          </Route>
          <Route path={`${match.url}/${rootPath}`}>
            <UploadFile />
          </Route>
        </Switch>
      </DrawerContent>
    </RightDrawer>
  );
}
