import React from 'react';
import { Switch, Route } from 'react-router-dom';
import loadable from '../../utils/loadable';
import ClonePreview from '../../views/Clone/Preview';
import CloneSetup from '../../views/Clone/Setup';
import getRoutePath from '../../utils/routePaths';
import AmpersandRoutesHandler from './AmpersandRoutesHandler';
import { AMPERSAND_ROUTES, HOME_PAGE_PATH } from '../../utils/constants';
import retry from '../../utils/retry';
import ResourceListInfo from '../../views/ResourceList/infoText';

const IntegrationAppAddNewChild = loadable(() =>
  retry(() => import(/* webpackChunkName: 'IntegrationAppAddNewChild' */ '../../views/Integration/App/drawers/AddChild'))
);
const IntegrationAppUninstallation = loadable(() =>
  retry(() => import(/* webpackChunkName: 'IntegrationAppUninstallation' */ '../../views/Integration/App/drawers/Uninstall/index'))
);
const IntegrationInstallation = loadable(() =>
  retry(() => import(/* webpackChunkName: 'IntegrationInstallation' */ '../../views/Integration/App/drawers/Install'))
);
const Marketplace = loadable(() =>
  retry(() => import(/* webpackChunkName: 'Marketplace' */ '../../views/Marketplace'))
);
const MarketplaceList = loadable(() =>
  retry(() => import(/* webpackChunkName: 'MarketplaceList' */ '../../views/MarketplaceList'))
);
const CeligoPortal = loadable(() =>
  retry(() => import(/* webpackChunkName: 'CeligoPortal' */ '../../views/CeligoPortal'))
);
const UpgradeEM = loadable(() =>
  retry(() => import(/* webpackChunkName: 'UpgradeErrorManagement' */ '../../views/UpgradeErrorManagement'))
);
const RecycleBin = loadable(() =>
  retry(() => import(/* webpackChunkName: 'RecycleBin' */ '../../views/RecycleBin'))
);
const Home = loadable(() =>
  retry(() => import(/* webpackChunkName: 'Home' */ '../../views/Home'))
);
const Dashboard = loadable(() =>
  retry(() => import(/* webpackChunkName: 'Dashboard' */ '../../views/Dashboard'))
);
const NotFound = loadable(() =>
  retry(() => import(/* webpackChunkName: 'NotFound' */ '../../views/NotFound'))
);
const Permissions = loadable(() =>
  retry(() => import(/* webpackChunkName: 'Permissions' */ '../../views/Permissions'))
);
const Reports = loadable(() =>
  retry(() => import(/* webpackChunkName: 'Reports' */ '../../views/Reports'))
);
const Playground = loadable(() =>
  retry(() => import(/* webpackChunkName: 'Playground' */ '../../views/Playground'))
);
const FlowBuilder = loadable(() =>
  retry(() => import(/* webpackChunkName: 'FlowBuilder' */ '../../views/FlowBuilder'))
);
const ResourceList = loadable(() =>
  retry(() => import(/* webpackChunkName: 'ResourceList' */ '../../views/ResourceList'))
);
const TemplateList = loadable(() =>
  retry(() => import(/* webpackChunkName: 'Marketplace' */ '../../views/TemplateList'))
);
const MyAccount = loadable(() =>
  retry(() => import(/* webpackChunkName: 'MyAccount' */ '../../views/MyAccount'))
);
const Integration = loadable(() =>
  retry(() => import(/* webpackChunkName: 'IntegrationApp' */ '../../views/Integration'))
);
const AccessTokenList = loadable(() =>
  retry(() => import(
    /* webpackChunkName: 'AccessTokensList' */ '../../views/AccessTokenList'
  ))
);
const ConnectorInstallBase = loadable(() =>
  retry(() => import(
    /* webpackChunkName: 'InstallBase' */ '../../views/Connector/InstallBase'
  ))
);
const ConnectorLicenses = loadable(() =>
  retry(() => import(/* webpackChunkName: 'Licenses' */ '../../views/Connector/Licenses'))
);

const SuiteScriptIntegration = loadable(() =>
  retry(() => import(
    /* webpackChunkName: 'SuiteScriptIntegration' */ '../../views/SuiteScript/Integration/DIY'
  ))
);

const SuiteScriptIntegrationApp = loadable(() =>
  retry(() => import(
    /* webpackChunkName: 'SuiteScriptIntegration' */ '../../views/SuiteScript/Integration/App'
  ))
);

const SuiteScriptFlowBuilder = loadable(() =>
  retry(() => import(
    /* webpackChunkName: 'SuiteScriptFlowBuilder' */ '../../views/SuiteScript/FlowBuilder'
  ))
);
const SuiteScriptIntegrationAppInstallation = loadable(() =>
  retry(() => import(
    /* webpackChunkName: 'SuiteScriptIntegrationAppInstallation' */ '../../views/SuiteScript/Integration/App/Install'
  ))
);

function ResourceListRouteCatcher(props) {
  const { match } = props;

  const isResource = !!ResourceListInfo[(match?.params?.resourceType || '')];

  return <>{ isResource ? <ResourceList props={props} /> : <NotFound /> }</>;
}

export default function AppRouting() {
  // console.log('render: <AppRouting>');
  return (
    <Switch>
      <Route
        path={['/pg', '']}
        exact
        render={({ history }) => history.replace(getRoutePath(HOME_PAGE_PATH))}
        />
      <Route
        path={['/pg/*']}
        exact
        render={({ history, match }) => history.replace(getRoutePath(match.url.replace('/pg/', '/')))}
        />
      <Route
        path={getRoutePath('/clone/:resourceType/:resourceId')}
        exact
        render={({ history, match }) => history.replace(
          getRoutePath(`/clone/${match.params.resourceType}/${match.params.resourceId}/preview`)
        )}
        />
      <Route
        path={getRoutePath('/migrate')}
        exact
        component={UpgradeEM}
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
        path={getRoutePath('/integrations/:integrationId/setup')}
        component={IntegrationInstallation}
        />
      <Route
        path={getRoutePath('/templates/:templateName([\\w-]{5,})/:integrationId')}
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
        path={getRoutePath('/dashboard')}
        exact
        render={({ history }) =>
          history.replace(
            getRoutePath('/dashboard/runningFlows')
          )}
        />
      <Route
        path={getRoutePath('/integrationapps/:integrationAppName/:integrationId')}
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
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/child/:childId/flows/sections/:sectionId/flowBuilder/:flowId'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/child/:childId/flowBuilder/:flowId'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/flows/sections/:sectionId/flowBuilder/:flowId'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/flowBuilder/:flowId'),
          getRoutePath('/integrations/:integrationId/flowBuilder/:flowId'),
          getRoutePath('/integrations/:integrationId/flows/sections/:sectionId/flowBuilder/:flowId'),
          getRoutePath('/templates/:templateName([\\w-]{5,})/:integrationId/flowBuilder/:flowId'),
          getRoutePath('/templates/:templateName([\\w-]{5,})/:integrationId/flows/sections/:sectionId/flowBuilder/:flowId'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/child/:childId/flows/sections/:sectionId/dataLoader/:flowId'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/child/:childId/dataLoader/:flowId'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/flows/sections/:sectionId/dataLoader/:flowId'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/dataLoader/:flowId'),
          getRoutePath('/templates/:templateName([\\w-]{5,})/:integrationId/dataLoader/:flowId'),
          getRoutePath('/templates/:templateName([\\w-]{5,})/:integrationId/flows/sections/:sectionId/dataLoader/:flowId'),
          getRoutePath('/integrations/:integrationId/dataLoader/:flowId'),
          getRoutePath('/integrations/:integrationId/flows/sections/:sectionId/dataLoader/:flowId'),
        ]}>
        <FlowBuilder />
      </Route>

      <Route
        path={getRoutePath('/integrationapps/:integrationAppName/:integrationId/setup')}
        component={IntegrationInstallation}
        />
      <Route
        path={getRoutePath('/clone/integrationapps/:integrationAppName/:integrationId/setup')}
        component={IntegrationInstallation}
        />
      <Route
        path={getRoutePath('/integrationapps/:integrationAppName/:integrationId/install/addNewStore')}
        component={IntegrationAppAddNewChild}
        />
      <Route
        path={[
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/uninstall/child/:childId'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/uninstall'),
        ]}
        component={IntegrationAppUninstallation}
        />

      <Route
        path={[
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/child/:childId/dashboard/sections/:sectionId/:dashboardTab(runningFlows|completedFlows)'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/child/:childId/:tab/sections/:sectionId'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/child/:childId/dashboard/:dashboardTab(runningFlows|completedFlows)'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/child/:childId/:tab'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/child/:childId'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/dashboard/sections/:sectionId/:dashboardTab(runningFlows|completedFlows)'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/:tab/sections/:sectionId'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/dashboard/:dashboardTab(runningFlows|completedFlows)'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId/:tab'),
          getRoutePath('/integrationapps/:integrationAppName/:integrationId'),
          getRoutePath('/integrations/:integrationId/dashboard/sections/:sectionId/:dashboardTab(runningFlows|completedFlows)'),
          getRoutePath('/integrations/:integrationId/:tab/sections/:sectionId'),
          getRoutePath('/integrations/:integrationId/dashboard/:dashboardTab(runningFlows|completedFlows)'),
          getRoutePath('/integrations/:integrationId/:tab'),
        ]}
        component={Integration}
        />
      <Route
        path={[getRoutePath('/templates/:templateName/:integrationId([a-f\\d]{24})/dashboard/sections/:sectionId/:dashboardTab(runningFlows|completedFlows)'),
          getRoutePath('/templates/:templateName/:integrationId([a-f\\d]{24})/:tab/sections/:sectionId')]}
        component={Integration}
        />

      <Route
        path={[getRoutePath('/templates/:templateName/:integrationId([a-f\\d]{24})/dashboard/:dashboardTab(runningFlows|completedFlows)'),
          getRoutePath('/templates/:templateName/:integrationId([a-f\\d]{24})/:tab')]}
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

      <Route path={getRoutePath(HOME_PAGE_PATH)} component={Home} />
      <Route path={getRoutePath('/dashboard/:dashboardTab(runningFlows|completedFlows)')} component={Dashboard} />
      <Route path={getRoutePath('/recycleBin')} component={RecycleBin} />
      <Route path={getRoutePath('/celigoPortal')} component={CeligoPortal} />
      <Route
        path={[
          getRoutePath('/reports/:reportType'),
          getRoutePath('/reports')]} component={Reports} />
      <Route path={getRoutePath('/playground')} component={Playground} />
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
        path={[
          getRoutePath('/suitescript/:ssLinkedConnectionId/integrationapps/:integrationAppName/setup'),
          getRoutePath('/suitescript/integrationapps/:integrationAppName/setup')]}
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
      {/* we need this to differentiate between a valid resource path and a 404.
          so resourceList and notfound are moved inside the catcher */}
      <Route path={getRoutePath('/:resourceType')} component={ResourceListRouteCatcher} />
    </Switch>
  );
}
