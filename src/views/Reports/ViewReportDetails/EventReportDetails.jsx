import { Typography } from '@material-ui/core';
import React, { Fragment } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useSelectorMemo } from '../../../hooks';
import { selectors } from '../../../reducers';

const flowsConfig = {type: 'flows'};

const eventReportDetailRows = [

  { heading: 'Integration',
    value: function IntegrationName(r) {
      const integrationId = useSelector(state => selectors.resource(state, 'flows', r?._flowIds[0])?._integrationId);
      const integration = useSelector(state => selectors.resource(state, 'integrations', integrationId));

      return integration?.name;
    },
  },
  {
    heading: 'Stores',
    value: function StoreNames(r) {
      const integrationId = useSelector(state => selectors.resource(state, 'flows', r?._flowIds[0])?._integrationId);

      const childIntegrationsLabels = useSelector(state => selectors.getChildIntegrationLabelsTiedToFlows(state, integrationId, r?._flowIds), shallowEqual);

      return childIntegrationsLabels?.map(label => (
        <Fragment key={label}>
          <div />
          <Typography>{label}</Typography>
        </Fragment>
      )
      );
    },
  },
  {
    heading: 'Flows',
    value: function FlowsPertainingToEventReport(r) {
      const allFlows = useSelectorMemo(
        selectors.makeResourceListSelector,
        flowsConfig
      ).resources;

      const flows = r._flowIds.map(id => allFlows.find(f => f._id === id));

      return (
        <>
          <Typography>{flows?.length} flows</Typography>
          {flows?.map(({name}) => (
            <Fragment key={name}>
              <div />
              <Typography>{name}</Typography>
            </Fragment>
          ))}
        </>
      );
    },
  },
  {
    heading: 'Date Range',
    value: function EventReportStartDate(r) {
      return <Typography>  {r.startTime} - { r.endTime}</Typography>;
    },

  },

  {
    heading: 'Last Run',
    value: function EventReportStartDate(r) {
      // check if this is the last run value
      return <Typography>  {r.startedAt}</Typography>;
    },

  },
  {
    heading: 'Status',
    value: function EventReportStatus(r) {
      return r?.status;
    },
  },
  {
    heading: 'Requested By',
    value: function RequestedByUser(r) {
      const users = useSelector(state => selectors.availableUsersList(state));

      if (!r || !users) return null;

      const {sharedWithUser} = users.find(u => u?.sharedWithUser?._id === r._requestedByUserId) || {};
      const {name, email} = sharedWithUser || {};

      return name || email || r._requestedByUserId;
    },
  },

];

export default function ViewReportDetails({resource}) {
//   if (!resource) { return null; }

  return (
    eventReportDetailRows.map(({heading, value}) => (
      <div key={heading} >
        {heading} :{value(resource)}
      </div>

    ))
  );
}
