import { Route } from 'react-router';
import Marketplace from './';
import List from '../../components/MarketplaceList/ConnectorTemplateList';
import TemplateInstall from '../../views/Templates/Install';
import TemplatePreview from '../../views/Templates/Preview';

export default function MarketplaceRouter({ match }) {
  return (
    <div>
      <Route
        path="/pg/marketplace/templates/:templateId/preview"
        component={TemplatePreview}
      />
      <Route
        path="/pg/marketplace/templates/:templateId/setup"
        component={TemplateInstall}
      />
      <Route path={`${match.url}/:application`} component={List} />
      <Route exact path={`${match.url}`} component={Marketplace} />
    </div>
  );
}
