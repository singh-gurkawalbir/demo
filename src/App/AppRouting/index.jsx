import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import loadable from '../../utils/loadable';
import ClonePreview from '../../views/Clone/Preview';
import IntegrationAppInstallation from '../../views/Integration/App/drawers/Install';
import IntegrationAppAddNewStore from '../../views/Integration/App/drawers/AddStore';
import IntegrationAppUninstallation from '../../views/Integration/App/drawers/Uninstall/index';
import Marketplace from '../../views/MarketPlace';
import MarketplaceList from '../../views/MarketplaceList';
import CloneSetup from '../../views/Clone/Setup';

const RecycleBin = loadable(() =>
  import(/* webpackChunkName: 'RecycleBin' */ '../../views/RecycleBin')
);
const Dashboard = loadable(() =>
  import(/* webpackChunkName: 'Dashboard' */ '../../views/Dashboard')
);
const NotFound = loadable(() =>
  import(/* webpackChunkName: 'NotFound' */ '../../views/NotFound')
);
const Permissions = loadable(() =>
  import(/* webpackChunkName: 'Permissions' */ '../../views/Permissions')
);
const Resources = loadable(() =>
  import(/* webpackChunkName: 'Resources' */ '../../views/Resources')
);
const Editors = loadable(() =>
  import(/* webpackChunkName: 'Editors' */ '../../views/Editors')
);
const FlowBuilder = loadable(() =>
  import(/* webpackChunkName: 'FlowBuilder' */ '../../views/FlowBuilder')
);
const ResourceList = loadable(() =>
  import(/* webpackChunkName: 'ResourceList' */ '../../views/ResourceList')
);
const TemplateList = loadable(() =>
  import(/* webpackChunkName: 'Marketplace' */ '../../views/TemplateList')
);
const MyAccount = loadable(() =>
  import(/* webpackChunkName: 'MyAccount' */ '../../views/MyAccount')
);
const Integration = loadable(() =>
  import(/* webpackChunkName: 'Integration' */ '../../views/Integration/DIY')
);
const IntegrationApp = loadable(() =>
  import(/* webpackChunkName: 'IntegrationApp' */ '../../views/Integration/App')
);
const AccessTokenList = loadable(() =>
  import(
    /* webpackChunkName: 'AccessTokensList' */ '../../views/AccessTokenList'
  )
);
const ConnectorInstallBase = loadable(() =>
  import(
    /* webpackChunkName: 'InstallBase' */ '../../views/Connector/InstallBase'
  )
);
const ConnectorLicenses = loadable(() =>
  import(/* webpackChunkName: 'Licenses' */ '../../views/Connector/Licenses')
);

export default class AppRouting extends Component {
  render() {
    // console.log('render: <AppRouting>');

    return (
      <Switch>
        <Route
          path="/pg"
          exact
          render={({ history }) => history.replace('/pg/dashboard')}
        />
        <Route
          path="/pg/clone/:resourceType/:resourceId/preview"
          component={ClonePreview}
        />
        <Route
          path="/pg/clone/:resourceType/:resourceId/setup"
          component={CloneSetup}
        />
        <Route
          path="/pg/templates/:templateName([\w-]{5,})/:integrationId"
          exact
          render={({ history, match }) =>
            history.replace(
              `/pg/templates/${match.params.templateName}/${match.params.integrationId}/flows`
            )}
        />
        <Route
          path="/pg/integrations/:integrationId"
          exact
          render={({ history, match }) =>
            history.replace(
              `/pg/integrations/${match.params.integrationId}/flows`
            )}
        />

        <Route
          path="/pg/marketplace/templates/:templateId"
          exact
          render={({ history, match }) =>
            history.replace(
              `/pg/marketplace/templates/${match.params.templateId}/preview`
            )}
        />
        <Route
          path={[
            '/pg/integrationapps/:integrationAppName/:integrationId/flowBuilder/:flowId',
            '/pg/integrationapps/v2/:integrationAppName/:integrationId/flowBuilder/:flowId',
            '/pg/integrations/:integrationId/flowBuilder/:flowId',
            '/pg/templates/:templateName([\\w-]{5,})/:integrationId/flowBuilder/:flowId',
            '/pg/integrationapps/:integrationAppName/:integrationId/dataLoader/:flowId',
            '/pg/integrationapps/v2/:integrationAppName/:integrationId/dataLoader/:flowId',
            '/pg/templates/:templateName([\\w-]{5,})/:integrationId/dataLoader/:flowId',
            '/pg/integrations/:integrationId/dataLoader/:flowId',
          ]}>
          <FlowBuilder />
        </Route>

        <Route
          path={[
            '/pg/integrationapps/v2/:integrationAppName/:integrationId/child/:childId/:tab',
            '/pg/integrationapps/v2/:integrationAppName/:integrationId/:tab',
            '/pg/integrationapps/v2/:integrationAppName/:integrationId',
            '/pg/integrations/:integrationId/:tab',
          ]}
          component={Integration}
        />

        <Route
          path={['/pg/integrationapps/:integrationAppName/:integrationId/setup',
            '/pg/integrationapps/v2/:integrationAppName/:integrationId/setup'
          ]}
          component={IntegrationAppInstallation}
        />
        <Route
          path="/pg/integrationapps/:integrationAppName/:integrationId/install/addNewStore"
          component={IntegrationAppAddNewStore}
        />
        <Route
          path={[
            '/pg/integrationapps/:integrationAppName/:integrationId/uninstall/:storeId',
            '/pg/integrationapps/:integrationAppName/:integrationId/uninstall',
          ]}
          component={IntegrationAppUninstallation}
        />


        <Route
          path={[
            '/pg/integrationapps/:integrationAppName/:integrationId/child/:storeId/:tab',
            '/pg/integrationapps/:integrationAppName/:integrationId/:tab',
            '/pg/integrationapps/:integrationAppName/:integrationId',
          ]}
          component={IntegrationApp}
        />
        <Route
          // Slight hack here, Included a minimum word length of 4 for templateName to exclude add, edit to match template Name
          // templateName has structure of application2-application2 will contain atleast 5 characters
          path="/pg/templates/:templateName([\w-]{5,})/:integrationId/:tab"
          component={Integration}
        />

        <Route
          path="/pg/connectors/:connectorId/connectorLicenses"
          component={ConnectorLicenses}
        />
        <Route
          path="/pg/connectors/:connectorId/installBase"
          component={ConnectorInstallBase}
        />
        <Route
          path="/pg/marketplace/:application"
          component={MarketplaceList}
        />
        <Route exact path="/pg/marketplace" component={Marketplace} />

        <Route path="/pg/dashboard" component={Dashboard} />
        <Route path="/pg/recycleBin" component={RecycleBin} />
        <Route path="/pg/resources" component={Resources} />
        <Route path="/pg/editors" component={Editors} />
        <Route path="/pg/permissions" component={Permissions} />
        <Route
          path="/pg/myAccount"
          exact
          render={({ history }) => history.replace('/pg/myAccount/profile')}
        />
        <Route path="/pg/myAccount/:tab" component={MyAccount} />
        <Route path="/pg/templates" component={TemplateList} />
        <Route path="/pg/accesstokens" component={AccessTokenList} />
        <Route
          path="/pg/tokens"
          exact
          render={({ history }) => history.replace('/pg/accesstokens')}
        />
        <Route path="/pg/:resourceType" component={ResourceList} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}
