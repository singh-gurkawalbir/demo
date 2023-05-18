import React, { useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import { PillTabGroup } from '@celigo/fuse-ui';
import { useTabContext } from '../CeligoTabWrapper';

export default function CeligoPillTabs(props) {
  const { tabs, defaultTab } = props;
  const {activeTab, setActiveTab} = useTabContext();

  const handleChange = useCallback((event, value) => {
    setActiveTab(value);
  }, [setActiveTab]);

  useEffect(() => {
    setActiveTab(defaultTab || tabs?.[0]?.value);
  }, [defaultTab, tabs, setActiveTab]);

  if (!tabs?.length) {
    return null;
  }

  return (
    <Box textAlign="center" position="relative">
      <PillTabGroup
        value={activeTab}
        onChange={handleChange}
        exclusive
        options={tabs}
      />
    </Box>
  );
}

