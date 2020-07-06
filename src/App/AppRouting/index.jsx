import React from 'react';
import { Switch, Route } from 'react-router-dom';
import loadable from '../../utils/loadable';
import ClonePreview from '../../views/Clone/Preview';
import IntegrationAppInstallation from '../../views/Integration/App/drawers/Install';
import IntegrationAppAddNewStore from '../../views/Integration/App/drawers/AddStore';
import IntegrationAppUninstallation from '../../views/Integration/App/drawers/Uninstall/index';
import Marketplace from '../../views/MarketPlace';
import MarketplaceList from '../../views/MarketplaceList';
import CloneSetup from '../../views/Clone/Setup';
import getRoutePath from '../../utils/routePaths';
import AmpersandRoutesHandler from './AmpersandRoutesHandler';
import { AMPERSAND_ROUTES } from '../../utils/constants';

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


const SuiteScriptIntegration = loadable(() =>
  import(
    /* webpackChunkName: 'SuiteScriptIntegration' */ '../../views/SuiteScript/Integration/DIY'
  )
);

const SuiteScriptIntegrationApp = loadable(() =>
  import(
    /* webpackChunkName: 'SuiteScriptIntegration' */ '../../views/SuiteScript/Integration/App'
  )
);

const SuiteScriptFlowBuilder = loadable(() =>
  import(
    /* webpackChunkName: 'SuiteScriptFlowBuilder' */ '../../views/SuiteScript/FlowBuilder'
  )
);
const SuiteScriptIntegrationAppInstallation = loadable(() =>
  import(
    /* webpackChunkName: 'SuiteScriptIntegrationAppInstallation' */ '../../views/SuiteScript/Integration/App/Install'
  )
);

export default function AppRouting() {
  // console.log('render: <AppRouting>');
  return (
    <Switch>
      <Route
        path={['/pg', '']}
        exact
        render={({ history }) => history.replace(getRoutePath('/dashboard'))}
        />
      <Route
        path={getRoutePath('/clone/:resourceType/:resourceId')}
        exact
        render={({ history, match }) => history.replace(
          getRoutePath(`/clone/${match.params.resourceType}/${match.params.resourceId}/preview`)
        )}
        />
      <Route
        path={getRoutePath('/clone/:resourceType/:resourceId/preview')}
        component={ClonePreview}
        />
      <Route
        path={getRoutePath('/clone/:resourceType/:resourceId/setup')}
        component={CloneSetup}
        />
      <Route
        path={getRoutePath('/templates/:templateName([\w-]{5,})/:integrationId')}
        exact
        render={({ history, match }) =>
          history.replace(
            getRoutePath(`/templates/${match.params.templateName}/${match.params.integrationId}/flows`)
          )}
        />
      <Route
        path={getRoutePath('/integrations/:integrationId')}
        exact
        render={({ history, match }) =>
          history.replace(
            getRoutePath(`/integrations/${match.params.integrationId}/flows`)
          )}
        />

      <Route
        path={getRoutePath('/marketplace/templates/:templateId')}
        exact
        render={({ history, match }) =>
          history.replace(
            getRoutePath(`/marketplace/templates/${match.params.templateId}/preview`)
          )}
        />
      <Route
        path={[
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/flowBuilder/:flowId'),
          getRoutePath('/integrations/:integrationId/flowBuilder/:flowId'),
          getRoutePath('/templates/:templateName([\\w-]{5,})/:integrationId/flowBuilder/:flowId'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/dataLoader/:flowId'),
          getRoutePath('/templates/:templateName([\\w-]{5,})/:integrationId/dataLoader/:flowId'),
          getRoutePath('/integrations/:integrationId/dataLoader/:flowId'),
        ]}>
        <FlowBuilder />
      </Route>

      <Route
        path={getRoutePath('/integrationapps/:integrationAppName/:integrationId/setup')}
        component={IntegrationAppInstallation}
        />
      <Route
        path={getRoutePath('/integrationapps/:integrationAppName/:integrationId/install/addNewStore')}
        component={IntegrationAppAddNewStore}
        />
      <Route
        path={[
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/uninstall/:storeId'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/uninstall'),
        ]}
        component={IntegrationAppUninstallation}
        />


      <Route
        path={[
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/child/:storeId/:tab'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/:tab'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId'),
          getRoutePath('/integrations/:integrationId/:tab')
        ]}
        component={Integration}
        />
      <Route
          // Slight hack here, Included a minimum word length of 4 for templateName to exclude add, edit to match template Name
          // templateName has structure of application2-application2 will contain atleast 5 characters
        path={getRoutePath('/templates/:templateName([\w-]{5,})/:integrationId/:tab')}
        component={Integration}
        />

      <Route
        path={getRoutePath('/connectors/:connectorId/connectorLicenses')}
        component={ConnectorLicenses}
        />
      <Route
        path={getRoutePath('/connectors/:connectorId/installBase')}
        component={ConnectorInstallBase}
        />
      <Route
        path={getRoutePath('/marketplace/:application')}
        component={MarketplaceList}
        />
      <Route exact path={getRoutePath('/marketplace')} component={Marketplace} />

      <Route path={getRoutePath('/dashboard')} component={Dashboard} />
      <Route path={getRoutePath('/recycleBin')} component={RecycleBin} />
      <Route path={getRoutePath('/editors')} component={Editors} />
      <Route path={getRoutePath('/permissions')} component={Permissions} />
      <Route
        path={getRoutePath('/myAccount')}
        exact
        render={({ history }) => history.replace(getRoutePath('/myAccount/profile'))}
        />
      <Route path={getRoutePath('/myAccount/:tab')} component={MyAccount} />
      <Route path={getRoutePath('/templates')} component={TemplateList} />
      <Route path={getRoutePath('/accesstokens')} component={AccessTokenList} />
      <Route
        path={getRoutePath('/tokens')}
        exact
        render={({ history }) => history.replace(getRoutePath('/accesstokens'))}
        />
      <Route
        path={getRoutePath('/suitescript/integrationapps/:integrationAppName/setup')}
        >
        <SuiteScriptIntegrationAppInstallation />
      </Route>
      <Route
        path={getRoutePath('/suitescript/:ssLinkedConnectionId/integrations/:integrationId')}
        exact
        render={({ history, match }) => {
          history.replace(
            getRoutePath(`/suitescript/${match.params.ssLinkedConnectionId}/integrations/${match.params.integrationId}/flows`)
          );
        }}
      />
      <Route
        path={getRoutePath('/suitescript/:ssLinkedConnectionId/integrationapps/:integrationAppName/:integrationId')}
        exact
        render={({ history, match }) => {
          history.replace(
            getRoutePath(`/suitescript/${match.params.ssLinkedConnectionId}/integrationapps/${match.params.integrationAppName}/${match.params.integrationId}/flows`)
          );
        }}
      />
      <Route
        path={[
          getRoutePath('/suitescript/:ssLinkedConnectionId/integrations/:integrationId/flowBuilder/:flowId'),
          getRoutePath('/suitescript/:ssLinkedConnectionId/integrationapps/:integrationAppName/:integrationId/flowBuilder/:flowId'),
        ]}>
        <SuiteScriptFlowBuilder />
      </Route>
      <Route
        path={getRoutePath('/suitescript/:ssLinkedConnectionId/integrations/:integrationId/:tab')}
        component={SuiteScriptIntegration}
      />
      <Route
        path={getRoutePath('/suitescript/:ssLinkedConnectionId/integrationapps/:integrationAppName/:integrationId/:tab')}
        component={SuiteScriptIntegrationApp}
      />
      <Route
        exact
        path={[...AMPERSAND_ROUTES]}
        component={AmpersandRoutesHandler}
      />
      <Route path={getRoutePath('/:resourceType')} component={ResourceList} />
      <Route component={NotFound} />
    </Switch>
  );
}
