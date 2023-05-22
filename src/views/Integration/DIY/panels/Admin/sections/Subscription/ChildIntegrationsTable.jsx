import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sortBy } from 'lodash';
import moment from 'moment';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import CeligoTable from '../../../../../../../components/CeligoTable';
import ChildUpgradeButton from './ChildUpgradeButton';
import { getTitleFromEdition } from '../../../../../../../utils/integrationApps';

const useStyles = makeStyles(theme => ({
  childIntegrationList: {
    margin: theme.spacing(0, 2),
    border: `1px solid ${theme.palette.secondary.lightest}`,
    borderRadius: theme.spacing(0.5),
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root': {
        background: theme.palette.background.default,
      },
    },
  },
}));

const metadata = {
  useColumns: () => {
    const dateFormat = useSelector(state => selectors.userProfilePreferencesProps(state)?.dateFormat);
    const columns = [
      {
        key: 'name',
        heading: 'Name',
        isLoggable: true,
        Value: ({rowData: r}) => r.name,
      },
      {
        key: 'installedOn',
        heading: 'Installed on',
        isLoggable: true,
        Value: ({rowData: r}) => r.installedOn ? moment(r.installedOn).format(dateFormat || 'MMM D, YYYY') : '',
      },
      {
        key: 'edition',
        heading: 'Edition',
        Value: ({rowData: r}) => r.plan,
        isLoggable: true,
      },
      {
        key: 'status',
        heading: 'Status',
        isLoggable: true,
        Value: ({rowData: r}) => <ChildUpgradeButton resource={r} />,
      },
    ];

    return columns;
  },
};

export default function ChildIntegrationsTable({ integrationId, allChildIntegrations }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const licenses = useSelector(state => selectors.licenses(state));
  const integration = useSelector(state => selectors.integrationAppSettings(state, integrationId));
  const parentLicenseId = licenses.find(license => license._integrationId === integrationId)?._id;
  const childLicenses = licenses.filter(license => (!!license?._integrationId) && (license?._parentId === parentLicenseId));
  const integrationAppList = useSelector(state => selectors.publishedConnectors(state));
  const parentStatus = useSelector(state => selectors.getStatus(state, integrationId)?.status);

  const data = useMemo(() => {
    const childList = childLicenses.map(license => {
      const { _id: id, name, createdAt: installedOn } = allChildIntegrations.find(i => i._id === license._integrationId) || {};

      const connector = integrationAppList?.find(ia => ia._id === license?._connectorId);
      const editions = connector?.twoDotZero?.editions || [];
      const edition = (editions.find(ed => ed._id === license._editionId) || {})?.displayName;

      const plan = edition ? `${getTitleFromEdition(edition)} plan` : '';

      return {
        id,
        name,
        installedOn,
        plan,
        changeEditionId: license?._changeEditionId,
      };
    });

    return sortBy(childList, ['name']);
  }, [allChildIntegrations, childLicenses, integrationAppList]);

  useEffect(() => {
    if (parentStatus === 'done') {
      const childList = data.map(child => child.id);

      dispatch(actions.integrationApp.upgrade.addChildForUpgrade(childList));
      dispatch(actions.integrationApp.upgrade.setStatus('successMessageFlags', {
        showMessage: true,
        showFinalMessage: true,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentStatus]);

  return (
    <>
      <Typography variant="h4" sx={{ padding: theme => theme.spacing(0, 2, 2) }}>{integration?.childDisplayName || ''}</Typography>
      <CeligoTable
        data={data}
        {...metadata}
        className={classes.childIntegrationList}
    />
    </>
  );
}
