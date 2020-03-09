import { useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import RightDrawer from '../../Right';
import Preview from './Preview';
import Setup from '../common/Setup';

const rootPath = 'installTemplate';

export default function InstallTemplateDrawer() {
  const match = useRouteMatch();
  const history = useHistory();
  const handleClose = useCallback(() => {
    // we don't know if there were other history events, so we cant just do history.goBack.
    // we can however just remove all segments of the url including and AFTER the rootPath of the drawer.
    const newUrl = match.url.split(rootPath)[0];

    history.push(newUrl);
  }, [history, match.url]);
  const hideBackButton = history.location.pathname.includes(`/preview/`);

  return (
    <RightDrawer
      onClose={handleClose}
      hideBackButton={hideBackButton}
      path={rootPath}
      title="Install Template"
      height="tall"
      width="large">
      <Switch>
        <Route path={`${match.url}/${rootPath}/preview/:templateId`}>
          <Preview />
        </Route>
        <Route path={`${match.url}/${rootPath}/setup/:templateId`}>
          <Setup />
        </Route>
      </Switch>
    </RightDrawer>
  );
}
