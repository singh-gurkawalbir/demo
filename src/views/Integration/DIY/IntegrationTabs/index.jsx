import React from 'react';
import TabContent from '../../../../components/TabContent';
import IntegrationTabs from '../../common/Tabs';
import { useAvailableTabs } from '../useAvailableTabs';

export default function IntegrationTabsComponent() {
  const availableTabs = useAvailableTabs();

  return (
    <TabContent>
      <IntegrationTabs tabs={availableTabs} />
    </TabContent>
  );
}
