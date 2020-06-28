import React from 'react';
import { Switch, Route } from 'react-router-dom';
import shortid from 'shortid';
import loadable from '../../utils/loadable';
import ClonePreview from '../../views/Clone/Preview';
import IntegrationAppInstallation from '../../views/Integration/App/drawers/Install';
import IntegrationAppAddNewStore from '../../views/Integration/App/drawers/AddStore';
import IntegrationAppUninstallation from '../../views/Integration/App/drawers/Uninstall/index';
import Marketplace from '../../views/MarketPlace';
import MarketplaceList from '../../views/MarketplaceList';
import CloneSetup from '../../views/Clone/Setup';
import AmpersandRoutesHandler from './AmpersandRoutesHandler';

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
  import(/* webpackChunkName: 'IntegrationApp' */ '../../views/Integration')
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

export default function AppRouting() {
  // console.log('render: <AppRouting>');
  return (
    <Switch>
      <Route
        path="/pg"
        exact
        render={({ history }) => history.replace('/pg/dashboard')}
        />
      <Route
        path="/pg/clone/:resourceType/:resourceId"
        exact
        render={({ history, match }) => history.replace(
          `/pg/clone/${match.params.resourceType}/${match.params.resourceId}/preview`
        )}
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
          '/pg/integrations/:integrationId/flowBuilder/:flowId',
          '/pg/templates/:templateName([\\w-]{5,})/:integrationId/flowBuilder/:flowId',
          '/pg/integrationapps/:integrationAppName/:integrationId/dataLoader/:flowId',
          '/pg/templates/:templateName([\\w-]{5,})/:integrationId/dataLoader/:flowId',
          '/pg/integrations/:integrationId/dataLoader/:flowId',
        ]}>
        <FlowBuilder />
      </Route>

      <Route
        path="/pg/integrationapps/:integrationAppName/:integrationId/setup"
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
          '/pg/integrations/:integrationId/:tab'
        ]}
        component={Integration}
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
      {/*
         Ampersand Routers Handling begin
      */}
      <Route
        path={[
          '/pg/flows/create',
          'orchestrations/create',
          'flow-builder/v1_5/create'
        ]}
        exact
        render={({ history }) => history.replace(`/pg/integrations/none/flowBuilder/new-${shortid.generate()}`)}
      />
      <Route
        path="/pg/integrations/create"
        exact
        render={({ history }) => history.replace(`/pg/dashboard/add/integrations/new-${shortid.generate()}`)}
      />
      <Route
        path="/pg/:resourceType/create"
        exact
        render={({ history, match }) => history.replace(`/pg/${match.params.resourceType}/add/${match.params.resourceType}/new-${shortid.generate()}`)}
      />
      <Route
        path="/pg/:resourceType/:resourceId/edit"
        exact
        render={({ history, match }) => history.replace(`/pg/${match.params.resourceType}/edit/${match.params.resourceType}/${match.params.connectorId}`)}
      />
      <Route
        path="/pg/data-loader"
        exact
        render={({ history }) => history.replace(`/pg/integrations/none/dataLoader/new-${shortid.generate()}`)}
      />
      <Route
        path="/pg/integrations/:integrationId/data-loader"
        exact
        render={({ history, match }) => history.replace(`/pg/integrations/${match.params.integrationId}/dataLoader/new-${shortid.generate()}`)}
      />
      <Route
        path="/pg/integrations/:integrationId/data-loader/:flowId/edit"
        exact
        render={({ history, match }) => history.replace(`/pg/integrations/${match.params.integrationId}/dataLoader/${match.params.flowId}}`)}
      />
      <Route
        path={[
          '/pg/integrations/:integrationId/flow-builder/v1_5/:flowId/create',
          '/pg/integrations/:integrationId/flows/:flowId/edit',
          '/pg/integrations/:integrationId/flow-builder/v1_5/:flowId/edit',
          '/pg/integrations/:integrationId/orchestrations/:flowId/edit',
          '/pg/integrations/:integrationId/orchestrations/:flowId/exports/create',
        ]}
        exact
        render={({ history, match }) => history.replace(`/pg/integrations/${match.params.integrationId}/flowBuilder/${match.params.flowId}}`)}
      />
      <Route
        path={[
          '/pg/integrations/:integrationId/orchestrations/:flowId/:resourceType/create',
        ]}
        exact
        render={({ history, match }) => history.replace(`/pg/integrations/${match.params.integrationId}/flowBuilder/${match.params.flowId}}/add/${match.params.resourceType === 'exports' ? 'pageGenerator' : 'pageProcessor'}/new=${shortid.generate()}`)}
      />
      <Route
        path={[
          '/pg/integrations/:integrationId/orchestrations/:flowId/:resourceType/:resourceId/edit',
        ]}
        exact
        render={({ history, match }) => history.replace(`/pg/integrations/${match.params.integrationId}/flowBuilder/${match.params.flowId}}/edit/${match.params.resourceType === 'exports' ? 'pageGenerator' : 'pageProcessor'}/${match.params.resourceId}`)}
      />
      <Route
        path={[
          '/pg/integrations/:integrationId/flows/create',
          '/pg/integrations/:_integrationId/orchestrations/create',
          '/pg/integrations/:integrationId/flow-builder/v1_5/create'
        ]}
        exact
        render={({ history, match }) => history.replace(`/pg/integrations/${match.params.integrationId}/flowBuilder/new-${shortid.generate()}`)}
      />
      <Route
        path="/pg/connectors/:connectorId/licenses"
        exact
        render={({ history, match }) => history.replace(`/pg/connectors/${match.params.connectorId}/connectorLicenses`)}
      />
      <Route
        path="/pg/connectors/:connectorId/licenses/create"
        exact
        render={({ history, match }) => history.replace(`/pg/connectors/${match.params.connectorId}/connectorLicenses/add/connectorLicenses/new-${shortid.generate()}`)}
      />
      <Route
        path="/pg/connectors/:connectorId/licenses/:licenseId/edit"
        exact
        render={({ history, match }) => history.replace(`/pg/connectors/${match.params.connectorId}/connectorLicenses/edit/connectorLicenses/${match.params.licenseId}`)}
      />
      <Route
        path="/pg/clone/integrations/:_integrationId/:resourceType/:resourceId/preview"
        exact
        render={({ history, match }) => history.replace(`/pg/clone/${match.params.resourceType}/${match.params.resourceId}/preview`)}
      />
      <Route
        path="/pg/clone/integrations/:_integrationId/:resourceType/:resourceId/setup"
        exact
        render={({ history, match }) => history.replace(`/pg/clone/${match.params.resourceType}/${match.params.resourceId}/setup`)}
      />
      <Route
        path={[
          '/pg/my-account/audit-log'
        ]}
        exact
        render={({ history }) => history.replace('/pg/myAccount/audit')}
      />
      <Route
        path={[
          '/pg/my-account',
          '/pg/my-account/:section'
        ]}
        exact
        render={({ history, match }) => history.replace(`/pg/myAccount/${match.params.section || 'profile'}`)}
      />
      <Route
        exact
        path={[
          '/pg/connectors/:integrationId/add-new-store-for-connector',
          '/pg/connectors/:integrationId/settings',
          '/pg/connectors/:integrationId/settings/tokens/:accessTokenId/:accessTokenAction',
          '/pg/connectors/:integrationId/flows/:flowId/mapping',
          '/pg/getting-started',
          '/pg/licensing/flowLimitReached',
          '/pg/licensing/orchestration',
          '/pg/licensing/orchestrationLimitReached',
          '/pg/licensing/needSandboxAddon',
          '/pg/licensing/start',
          '/pg/releasenotes/list',
          '/pg/retry/edit',
        ]}
        component={AmpersandRoutesHandler}
      />
      <Route path="/pg/:resourceType" component={ResourceList} />
      <Route component={NotFound} />
    </Switch>
  );
}
