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
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  tabContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    borderTop: 'none',
    borderBottom: 'none',
  },
  grid: {
    marginTop: theme.spacing(2),
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
  const classes = useStyles();
  const referredByThisIntegration = (resourceReferences || []).filter(ref => ref.integrationId === integrationId);

  return (
    <CeligoTable className={classes.grid} data={referredByThisIntegration} {...thisIntegrationRefsMetadata} />
  );
};

const UsedByOtherIntegrationsTab = ({resourceReferences, integrationId}) => {
  const classes = useStyles();
  const referredByOtherIntegrations = (resourceReferences || []).filter(ref => ref.integrationId !== integrationId);

  return (
    <CeligoTable className={classes.grid} data={referredByOtherIntegrations} {...otherIntegrationRefsMetadata} />
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

  if (!resourceReferences.length) {
    return (
      <div className={classes.references}>
        No references
      </div>
    );
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
