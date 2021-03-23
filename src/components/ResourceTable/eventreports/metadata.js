import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';
import cancelReport from './actions/cancelReport';
import downloadResults from './actions/downloadResults';
import ViewReport from './actions/ViewReport';
import DateTimeDisplay from '../../DateTimeDisplay';

const flowsConfig = {type: 'flows'};
const metadata = {
  columns: [
    {
      heading: 'Integration',
      Value: function IntegrationName({r}) {
        const integrationId = useSelector(state => selectors.resource(state, 'flows', r?._flowIds[0])?._integrationId);
        const integration = useSelector(state => selectors.resource(state, 'integrations', integrationId));

        return integration?.name;
      },

    },
    {
      heading: 'Flows',
      Value: function FlowsPertainingToEventReport({r}) {
        const allFlows = useSelectorMemo(
          selectors.makeResourceListSelector,
          flowsConfig
        ).resources;

        const concatenedFlowNames = r._flowIds.map(id => allFlows.find(f => f._id === id)?.name).join(',');

        return concatenedFlowNames;
      },

    },
    {
      heading: 'Start Date',
      Value: function EventReportStartDate({r}) {
        return <DateTimeDisplay dateTime={r?.startTime} />;
      },
    },
    {
      heading: 'End Date',
      Value: function EventReportEndDate({r}) {
        return <DateTimeDisplay dateTime={r?.endTime} />;
      },
    },
    {
      heading: 'Status',
      Value: function EventReportStatus({r}) {
        return r?.status;
      },
    },
    {
      heading: 'Requested By',
      Value: function RequestedByUser({r}) {
        const users = useSelector(state => selectors.availableUsersList(state));

        if (!r || !users) return null;

        const {sharedWithUser} = users.find(u => u?.sharedWithUser?._id === r._requestedByUserId) || {};
        const {name, email} = sharedWithUser || {};

        return name || email || r._requestedByUserId;
      },
      orderBy: 'lastModified',
    },
  ],
  rowActions: r => {
    if (r.status === 'queued') {
      return [cancelReport(r)];
    }
    if (r.status === 'running') {
      return [ViewReport, cancelReport(r)];
    }
    if (r.status === 'completed') {
      return [ViewReport, downloadResults(r)];
    }

    return [];
  },
};

const translated = {
  ...metadata, columns: metadata.columns.map(({Value, ...rest}) => ({...rest, value: r => <Value r={r} />})),
};
export default translated;
