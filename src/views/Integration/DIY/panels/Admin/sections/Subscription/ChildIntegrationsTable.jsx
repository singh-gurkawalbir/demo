import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { selectors } from '../../../../../../../reducers';
import CeligoTable from '../../../../../../../components/CeligoTable';
import ChildUpgradeButton from './ChildUpgradeButton';
import { getTitleFromEdition } from '../../../../../../../utils/integrationApps';

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
  const licenses = useSelector(state => selectors.licenses(state));
  const parentLicenseId = licenses.find(license => license._integrationId === integrationId)?._id;
  const childLicenses = licenses.filter(license => license?._parentId === parentLicenseId);
  const integrationAppList = useSelector(state => selectors.publishedConnectors(state));

  const data = useMemo(() => childLicenses.map(license => {
    const { name, createdAt: installedOn } = allChildIntegrations.find(i => i._id === license._integrationId) || {};

    const connector = integrationAppList?.find(ia => ia._id === license?._connectorId);
    const editions = connector?.twoDotZero?.editions || [];
    const edition = (editions.find(ed => ed._id === license._editionId) || {})?.displayName;

    const plan = edition ? `${getTitleFromEdition(edition)} plan` : '';

    return {
      name,
      installedOn,
      plan,
    };
  }), [allChildIntegrations, childLicenses, integrationAppList]);

  return (
    <CeligoTable
      data={data}
      {...metadata}
    />
  );
}
