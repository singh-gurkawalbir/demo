import React from 'react';
import PageWrapper from '../../../../components/MainComponentWrapper';
import IntegrationTabs from '../../common/Tabs';
import { useAvailableTabs } from '../useAvailableTabs';

export default function IntegrationTabsComponent() {
  const availableTabs = useAvailableTabs();

  return (
    <PageWrapper isIntegrationTabsWrapper>
      <IntegrationTabs tabs={availableTabs} />
    </PageWrapper>
  );
}
