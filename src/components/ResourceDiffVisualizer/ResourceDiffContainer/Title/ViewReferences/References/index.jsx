import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Tabs, Tab } from '@material-ui/core';
import Spinner from '../../../../../Spinner';
import CeligoTable from '../../../../../CeligoTable';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers';
import { thisIntegrationRefsMetadata, otherIntegrationRefsMetadata } from './metadata';

const useStyles = makeStyles(theme => ({
  references: {
    height: '100%',
    backgroundColor: 'white',
    border: `1px solid ${theme.palette.secondary.lightest}`,
    color: theme.palette.text.hint,
    display: 'flex',
    flexDirection: 'column',
  },
  tabContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    borderTop: 'none',
    borderBottom: 'none',
  },
  tabHeader: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
}));

const tabs = [
  {
    label: 'Used by flows in this integration',
    dataTest: 'usedByInThisIntegration',
  },
  {
    label: 'Used by flows in other integrations',
    dataTest: 'usedByInOtherIntegrations',
  }];

const UsedByThisIntegrationTab = ({resourceReferences, integrationId}) => {
  console.log(integrationId);
  const referredByThisIntegration = (resourceReferences || []).filter(ref => ref.integrationId === integrationId);

  return (
    <CeligoTable data={referredByThisIntegration} {...thisIntegrationRefsMetadata} />
  );
};

const UsedByOtherIntegrationsTab = ({resourceReferences, integrationId}) => {
  const referredByOtherIntegrations = (resourceReferences || []).filter(ref => ref.integrationId !== integrationId);

  return (
    <CeligoTable data={referredByOtherIntegrations} {...otherIntegrationRefsMetadata} />
  );
};

export default function References({ resourceId, resourceType, integrationId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
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
    return <Spinner />;
  }

  return (
    <div className={classes.references}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary">
        {tabs.map(({ label, dataTest }, i) => (
          <Tab
            className={classes.tabHeader}
            key={label}
            id={i}
            value={i}
            aria-controls={i}
            label={label}
            data-test={dataTest}
        />
        ))}
      </Tabs>
      {tabIndex === 0 && <UsedByThisIntegrationTab resourceReferences={resourceReferences} integrationId={integrationId} />}
      {tabIndex === 1 && <UsedByOtherIntegrationsTab resourceReferences={resourceReferences} integrationId={integrationId} />}
    </div>
  );
}
