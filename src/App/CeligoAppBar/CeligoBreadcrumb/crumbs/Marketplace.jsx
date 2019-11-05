import applications from '../../../../constants/applications';

export default function MarketplaceCrumb({ app }) {
  const connector = applications.find(c => c.id === app);
  const applicationName = connector && connector.name;

  return applicationName || app;
}
