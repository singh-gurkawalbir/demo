import { Route, Switch } from 'react-router';
import IntegrationAppAddNewStore from './AddNewStore';
import IntegrationAppSettings from './Settings';
import IntegrationAppUninstallation from './Uninstaller';
import IntegrationAppInstallation from './Installer';
import ResourceList from '../ResourceList';

export default function IntegrationAppsRouter({ match }) {
  return (
    <Switch>
      <Route
        path={`${match.url}/:integrationId/setup`}
        component={IntegrationAppInstallation}
      />
      <Route
        path={`${match.url}/:integrationId/settings/:storeId/:section`}
        exact
        component={IntegrationAppSettings}
      />
      <Route
        path={`${match.url}/:integrationId/settings/:section`}
        exact
        component={IntegrationAppSettings}
      />
      <Route
        path={`${match.url}/:integrationId/settings/:storeId/:section/edit/:resourceType/:resourceId`}
        exact
        component={IntegrationAppSettings}
      />
      <Route
        path={`${match.url}/:integrationId/settings/:section/edit/:resourceType/:resourceId`}
        exact
        component={IntegrationAppSettings}
      />
      <Route
        path={`${match.url}/:integrationId/settings/:storeId/:section/add/:resourceType/:resourceId`}
        exact
        component={IntegrationAppSettings}
      />
      <Route
        path={`${match.url}/:integrationId/settings/:section/add/:resourceType/:resourceId`}
        exact
        component={IntegrationAppSettings}
      />
      <Route
        path={`${match.url}/:integrationId/settings`}
        component={IntegrationAppSettings}
      />
      <Route
        path={`${match.url}/:integrationId/install/addNewStore`}
        component={IntegrationAppAddNewStore}
      />
      <Route
        path={[
          `${match.url}/:integrationId/uninstall/:storeId`,
          `${match.url}/:integrationId/uninstall`,
        ]}
        component={IntegrationAppUninstallation}
      />
      <Route path="/pg/:resourceType" component={ResourceList} />
    </Switch>
  );
}
