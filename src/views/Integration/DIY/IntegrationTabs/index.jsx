import React from 'react';
import PageContent from '../../../../components/PageContent';
import IntegrationTabs from '../../common/Tabs';
import { useAvailableTabs } from '../useAvailableTabs';

export default function IntegrationTabsComponent() {
  const availableTabs = useAvailableTabs();

  return (
    <PageContent isIntegrationTabsWrapper>
      <IntegrationTabs tabs={availableTabs} />
    </PageContent>
  );
}
