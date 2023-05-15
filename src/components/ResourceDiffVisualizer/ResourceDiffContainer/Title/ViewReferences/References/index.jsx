import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Spinner, Tab, TabContext, TabList, TabPanel } from '@celigo/fuse-ui';
import CeligoTable from '../../../../../CeligoTable';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers';
import { thisIntegrationRefsMetadata, otherIntegrationRefsMetadata } from './metadata';

const tabs = [
  {
    label: 'Used by flows in this integration',
    dataTest: 'usedByInThisIntegration',
  },
  {
    label: 'Used by flows in other integrations',
    dataTest: 'usedByInOtherIntegrations',
  }];

const USED_BY_THIS_INTEGRATION_TAB = 0;
const USED_BY_OTHER_INTEGRATION_TAB = 1;

const UsedByThisIntegrationTab = ({resourceReferences, integrationId}) => {
  const referredByThisIntegration = useMemo(() =>
    (resourceReferences || []).filter(ref => ref.integrationId === integrationId),
  [integrationId, resourceReferences]);

  return (
    <CeligoTable sx={{mt: theme => theme.spacing(2)}} data={referredByThisIntegration} {...thisIntegrationRefsMetadata} />
  );
};

const UsedByOtherIntegrationsTab = ({resourceReferences, integrationId}) => {
  const referredByOtherIntegrations = useMemo(() =>
    (resourceReferences || []).filter(ref => ref.integrationId !== integrationId),
  [integrationId, resourceReferences]);

  return (
    <CeligoTable sx={{mt: theme => theme.spacing(2)}} data={referredByOtherIntegrations} {...otherIntegrationRefsMetadata} />
  );
};

export default function References({ resourceId, resourceType, integrationId }) {
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);

  const resourceReferences = useSelector(state => selectors.resourceReferencesPerIntegration(state, integrationId));

  const handleTabChange = (_, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  useEffect(() => {
    dispatch(actions.resource.requestReferences(resourceType, resourceId));

    return () => dispatch(actions.resource.clearReferences());
  }, [dispatch, resourceType, resourceId]);

  if (!resourceReferences) {
    return <Spinner center="screen" />;
  }

  if (!resourceReferences.length) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: theme => theme.spacing(2, 2, 0, 2),
          textAlign: 'center',
        }}>
        This resource isn’t being used anywhere.
      </Box>
    );
  }

  return (
    <TabContext value={tabIndex}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: theme => theme.spacing(2, 2, 0, 2),
          textAlign: 'center',
        }}>
        <TabList onChange={handleTabChange}>
          {tabs.map(({ label, dataTest }, i) => (
            <Tab
              key={label}
              id={i}
              value={i}
              aria-controls={i}
              label={label}
              data-test={dataTest} />
          ))}
        </TabList>
        <TabPanel value={USED_BY_THIS_INTEGRATION_TAB}>
          <UsedByThisIntegrationTab resourceReferences={resourceReferences} integrationId={integrationId} />
        </TabPanel>
        <TabPanel value={USED_BY_OTHER_INTEGRATION_TAB}>
          <UsedByOtherIntegrationsTab resourceReferences={resourceReferences} integrationId={integrationId} />
        </TabPanel>
      </Box>
    </TabContext>
  );
}
