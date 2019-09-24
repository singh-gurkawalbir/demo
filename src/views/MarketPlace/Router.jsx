import { Route } from 'react-router';
import DashboardRouter from './';
import List from '../../components/MarketplaceList/ConnectorTemplateList';
import TemplateInstall from '../../views/Templates/Install';
import TemplatePreview from '../../views/Templates/Preview';

export default function MarketplaceRouter() {
  return (
    <div>
      <Route path="/pg/marketplace/:application" component={List} />
      <Route path="/" component={DashboardRouter} />
      <Route
        path="/pg/marketplace/templates/:templateId/setup"
        component={TemplateInstall}
      />
      <Route
        path="/pg/marketplace/templates/:templateId/preview"
        component={TemplatePreview}
      />
    </div>
  );
}
