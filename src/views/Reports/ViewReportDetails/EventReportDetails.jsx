import { capitalize, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React, { Fragment } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import DateTimeDisplay from '../../../components/DateTimeDisplay';
import { useSelectorMemo } from '../../../hooks';
import { selectors } from '../../../reducers';
import { STANDALONE_INTEGRATION } from '../../../utils/constants';

const flowsConfig = {type: 'flows'};

const eventReportDetailRows = [

  {
    heading: 'Integration',
    value: function IntegrationName(r) {
      const integrationId = useSelector(state => selectors.resource(state, 'flows', r?._flowIds[0])?._integrationId);
      const integration = useSelector(state => selectors.resource(state, 'integrations', integrationId));

      return integration?.name || STANDALONE_INTEGRATION.name;
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
              <Typography>{name}</Typography>
            </Fragment>
          ))}
        </>
      );
    },
  },
  {
    heading: 'Date range',
    value: function EventReportStartDate(r) {
      return <Typography> <DateTimeDisplay dateTime={r.startTime} /> -  <DateTimeDisplay dateTime={r.endTime} /></Typography>;
    },

  },

  {
    heading: 'Last run',
    value: function EventReportLastRun(r) {
      // check if this is the last run value
      return <DateTimeDisplay dateTime={r?.startedAt} />;
    },

  },
  {
    heading: 'Status',
    value: function EventReportStatus(r) {
      return capitalize(r?.status);
    },
  },
  {
    heading: 'Requested by',
    value: function RequestedByUser(r) {
      const {requestedByUser} = r;

      if (!requestedByUser) return null;

      return requestedByUser.name || requestedByUser.email;
    },
  },

];

const useStyles = makeStyles(theme => ({
  listItem: {
    display: 'inline-flex',
  },
  listHeading: {
    width: '135px',
  },
  listValue: {
    paddingLeft: theme.spacing(1),
  },
  listRoot: {
    padding: theme.spacing(2),
  },
  tabWrapper: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    paddingLeft: theme.spacing(2),
  },
  reportDetailsWrapper: {
    background: theme.palette.background.paper,
    minHeight: '100%',
  },
}));

function Details({resource}) {
  const classes = useStyles();

  return (
    <List className={classes.listRoot} >
      {eventReportDetailRows.map(({heading, value}) => (
        <ListItem key={heading} >
          <ListItemText>
            <div className={classes.listItem}><Typography className={classes.listHeading}>{heading}:</Typography>  <Typography className={classes.listValue}>{value(resource)}</Typography></div>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}

export default function ViewReportDetails({resource}) {
  const classes = useStyles();

  return (
    <div className={classes.reportDetailsWrapper}>
      <Tabs
        value="viewDetails"
        textColor="primary"
        className={classes.tabWrapper}
        indicatorColor="primary" >
        <Tab
          label="View details"
          value="viewDetails"
        />
      </Tabs>
      <Details resource={resource} />
    </div>
  );
}
