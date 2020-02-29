import { Switch, Route, useRouteMatch } from 'react-router-dom';
import RightDrawer from '../Right';
import UploadFile from './UploadFile';
import Preview from './Preview';
import Setup from './Setup';

const rootPath = 'installIntegration';

export default function InstallIntegrationDrawer() {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path={rootPath}
      title="Install integration"
      height="tall"
      width="large">
      <Switch>
        <Route path={`${match.url}/${rootPath}/preview/:templateId`}>
          <Preview />
        </Route>
        <Route path={`${match.url}/${rootPath}/setup/:templateId`}>
          <Setup />
        </Route>
        <Route path={`${match.url}/${rootPath}`}>
          <UploadFile fileType="application/zip" />
        </Route>
      </Switch>
    </RightDrawer>
  );
}
