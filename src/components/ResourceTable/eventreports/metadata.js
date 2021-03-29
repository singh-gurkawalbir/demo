import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';
import DateFilter from '../commonCells/DateFilter';

import cancelReport from './actions/cancelReport';
import downloadResults from './actions/downloadResults';
import ViewReport from './actions/ViewReport';
import DateTimeDisplay from '../../DateTimeDisplay';
import Spinner from '../../Spinner';
import CeligoTruncate from '../../CeligoTruncate';
import {EVENT_REPORTS_DEFAULT} from '../../DynaForm/fields/integrations/DynaReportDateRange';
import { capitalize } from '../../../views/MyAccount/Subscription/Endpoint';
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
const useStyles = makeStyles(() => ({
  flex: {
    display: 'flex',
  },
}));

const flowsConfig = {type: 'flows'};
const metadata = {
  columns: [
    {
      headerValue: function IntegrationSearchFilter() {
        const integrationOptions = useSelector(state => selectors.getAllIntegrationsTiedToEventReports(state));

        return (
          <MultiSelectColumnFilter
            title="Integration"
            filterBy="integrationId"
            filterKey={FILTER_KEY}
            options={integrationOptions.map(({ _id, name}) => ({_id, name }))} />
        );
      },
      Value: function IntegrationName({r}) {
        const integrationId = useSelector(state => selectors.resource(state, 'flows', r?._flowIds[0])?._integrationId);
        const integration = useSelector(state => selectors.resource(state, 'integrations', integrationId));

        return integration?.name;
      },
    },
    {
      heading: 'Flows',
      headerValue: function FlowOptionsSearchFilter() {
        const flowOptions = useSelector(state => selectors.getAllFlowsTiedToEventReports(state));

        return (
          <MultiSelectColumnFilter
            title="Flows"
            filterBy="flowIds"
            filterKey={FILTER_KEY}
            options={flowOptions.map(({ _id, name}) => ({ _id, name }))} />
        );
      },
      Value: function FlowsPertainingToEventReport({r}) {
        const allFlows = useSelectorMemo(
          selectors.makeResourceListSelector,
          flowsConfig
        ).resources;

        const concatenedFlowNames = r._flowIds.map(id => allFlows.find(f => f._id === id)?.name).join(',');

        return (
          <CeligoTruncate dataPublic placement="top" lines={3} >
            {concatenedFlowNames}
          </CeligoTruncate>
        );
      },
    },
    {
      headerValue: function StartDateTimestamp() {
        return (
          <DateFilter
            title="Start Date"
            filterBy="startDate"
            filterKey={FILTER_KEY}
            customPresets={EVENT_REPORTS_DEFAULT}
            showTime />
        );
      },

      Value: function EventReportStartDate({r}) {
        return <DateTimeDisplay dateTime={r?.startTime} />;
      },
    },
    {
      headerValue: function EndDateTimestamp() {
        return (
          <DateFilter
            title="End Date"
            filterBy="endDate"
            filterKey={FILTER_KEY}
            customPresets={EVENT_REPORTS_DEFAULT}
            showTime />
        );
      },
      Value: function EventReportEndDate({r}) {
        return <DateTimeDisplay dateTime={r?.endTime} />;
      },
    },
    {
      heading: 'Status',
      headerValue: function SelectResponseCode() {
        return (
          <MultiSelectColumnFilter
            title="Status"
            filterBy="status"
            filterKey={FILTER_KEY}
            options={ALL_EVENT_STATUS.map(status => ({_id: status, name: capitalize(status) }))} />
        );
      },
      Value: function EventReportStatus({r}) {
        const classes = useStyles();

        if ([EVENT_REPORT_STATUS.QUEUED, EVENT_REPORT_STATUS.RUNNING].includes(r.status)) {
          return <div className={classes.flex}><Spinner /> {r?.status} </div>;
        }

        return capitalize(r?.status);
      },
    },
    {
      heading: 'Requested By',
      Value: function RequestedByUser({r}) {
        const {name, email} = useSelectorMemo(selectors.mkGetUserById, r._requestedByUserId) || {};

        return name || email || r._requestedByUserId;
      },
      orderBy: 'lastModified',
    },
  ],
  rowActions: r => {
    if (r.status === EVENT_REPORT_STATUS.QUEUED) {
      return [cancelReport(r)];
    }
    if (r.status === EVENT_REPORT_STATUS.RUNNING) {
      return [ViewReport, cancelReport(r)];
    }
    if (r.status === EVENT_REPORT_STATUS.COMPLETED) {
      return [ViewReport, downloadResults(r)];
    }

    return [];
  },
};

const translated = {
  ...metadata, columns: metadata.columns.map(({Value, ...rest}) => ({...rest, value: r => <Value r={r} />})),
};
export default translated;
