import { useEffect, useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import RightDrawer from '../Right';
import UploadFile from './UploadFile';
import Preview from './Preview';
import Setup from './Setup';

const rootPath = 'installIntegration';

function InstallIntegrationDrawerContent({ showBackButton }) {
  const match = useRouteMatch();

  useEffect(() => {
    showBackButton(!match.isExact);
  }, [match, match.isExact, showBackButton]);

  return (
    <Switch>
      <Route path={`${match.url}/preview/:templateId`}>
        <Preview />
      </Route>
      <Route path={`${match.url}/setup/:templateId`}>
        <Setup />
      </Route>
      <Route path={`${match.url}`}>
        <UploadFile />
      </Route>
    </Switch>
  );
}

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
      title="Install integration"
      height="tall"
      width="large">
      <InstallIntegrationDrawerContent />
    </RightDrawer>
  );
}
