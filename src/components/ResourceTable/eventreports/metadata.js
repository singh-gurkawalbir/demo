import React from 'react';
import { useSelector } from 'react-redux';
import { capitalize } from '@mui/material';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';
import DateFilter from '../commonCells/DateFilter';
import cancelReport from './actions/cancelReport';
import downloadResults from './actions/downloadResults';
import viewReport from './actions/viewReport';
import DateTimeDisplay from '../../DateTimeDisplay';
import CeligoTruncate from '../../CeligoTruncate';
import {EVENT_REPORTS_DEFAULT} from '../../DynaForm/fields/integrations/DynaReportDateRange';
import MultiSelectColumnFilter from '../commonCells/MultiSelectColumnFilter';

const EVENT_REPORT_STATUS = {
  QUEUED: 'queued',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELED: 'canceled',
};

Object.freeze(EVENT_REPORT_STATUS);
const ALL_EVENT_STATUS = [
  EVENT_REPORT_STATUS.QUEUED,
  EVENT_REPORT_STATUS.RUNNING,
  EVENT_REPORT_STATUS.COMPLETED,
  EVENT_REPORT_STATUS.FAILED,
  EVENT_REPORT_STATUS.CANCELED,
];

Object.freeze(ALL_EVENT_STATUS);
const FILTER_KEY = 'eventreports';

const flowsConfig = {type: 'flows'};
const metadata = {
  useColumns: () => [
    {
      key: 'integrationName',
      HeaderValue: function IntegrationSearchFilter() {
        const integrationOptions = useSelector(state => selectors.getAllIntegrationsTiedToEventReports(state));

        return (
          <MultiSelectColumnFilter
            title="Integration"
            filterBy="integrationId"
            filterKey={FILTER_KEY}
            options={integrationOptions.map(({ _id, name}) => ({_id, name }))} />
        );
      },
      isLoggable: true,
      Value: function IntegrationName({rowData: r}) {
        return useSelector(state => selectors.getEventReportIntegrationName(state, r));
      },
    },
    {
      key: 'flows',
      heading: 'Flows',
      HeaderValue: function FlowOptionsSearchFilter() {
        const integrationId = useSelector(state => selectors.filter(state, FILTER_KEY)?.integrationId);
        const flowOptions = useSelectorMemo(selectors.mkGetFlowsTiedToEventReports, integrationId);

        return (
          <MultiSelectColumnFilter
            title="Flows"
            filterBy="flowIds"
            filterKey={FILTER_KEY}
            options={flowOptions.map(({ _id, name}) => ({ _id, name }))} />
        );
      },
      isLoggable: true,
      Value: function FlowsPertainingToEventReport({rowData: r}) {
        const allFlows = useSelectorMemo(
          selectors.makeResourceListSelector,
          flowsConfig
        ).resources;

        const concatenedFlowNames = r._flowIds.map(id => allFlows.find(f => f._id === id)?.name || `Flow id: ${id}(Flow deleted)`).join(',');

        return (
          <CeligoTruncate isLoggable placement="top" lines={3} >
            {concatenedFlowNames}
          </CeligoTruncate>
        );
      },
    },
    {
      key: 'startDate',
      HeaderValue: function StartDateTimestamp() {
        return (
          <DateFilter
            title="Start date"
            filterBy="startDate"
            filterKey={FILTER_KEY}
            customPresets={EVENT_REPORTS_DEFAULT}
            showTime />
        );
      },
      isLoggable: true,
      Value: function EventReportStartDate({rowData: r}) {
        return <DateTimeDisplay dateTime={r?.startTime} />;
      },
    },
    {
      key: 'endDate',
      HeaderValue: function EndDateTimestamp() {
        return (
          <DateFilter
            title="End date"
            filterBy="endDate"
            filterKey={FILTER_KEY}
            customPresets={EVENT_REPORTS_DEFAULT}
            showTime />
        );
      },
      isLoggable: true,
      Value: function EventReportEndDate({rowData: r}) {
        return <DateTimeDisplay dateTime={r?.endTime} />;
      },
    },
    {
      key: 'timestamp',
      heading: 'Timestamp',
      isLoggable: true,
      Value: function Timestamp({rowData: r}) {
        return <DateTimeDisplay dateTime={r?.createdAt} />;
      },
    },
    {
      key: 'status',
      heading: 'Status',
      HeaderValue: function SelectResponseCode() {
        return (
          <MultiSelectColumnFilter
            title="Status"
            filterBy="status"
            filterKey={FILTER_KEY}
            options={ALL_EVENT_STATUS.map(status => ({_id: status, name: capitalize(status) }))} />
        );
      },
      isLoggable: true,
      Value: function EventReportStatus({rowData: r}) {
        if ([EVENT_REPORT_STATUS.QUEUED, EVENT_REPORT_STATUS.RUNNING].includes(r.status)) {
          return <Spinner size="small"> {capitalize(r?.status)}</Spinner>;
        }

        return capitalize(r?.status);
      },
    },
    {
      key: 'requestedBy',
      heading: 'Requested by',
      width: '130px',
      Value: function RequestedByUser({rowData: r}) {
        const {requestedByUser} = r;

        if (!requestedByUser) return null;

        return requestedByUser.name || requestedByUser.email;
      },
    },
  ],
  useRowActions: ({status}) => {
    if (status === EVENT_REPORT_STATUS.QUEUED) {
      return [cancelReport];
    }
    if (status === EVENT_REPORT_STATUS.RUNNING) {
      return [viewReport, cancelReport];
    }
    if (status === EVENT_REPORT_STATUS.COMPLETED) {
      return [viewReport, downloadResults];
    }

    return [];
  },
};

export default metadata;
