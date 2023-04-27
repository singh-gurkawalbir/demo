import { capitalize, Tab, Tabs, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React, { Fragment } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import DateTimeDisplay from '../../../components/DateTimeDisplay';
import { useSelectorMemo } from '../../../hooks';
import { selectors } from '../../../reducers';
import isLoggableAttr from '../../../utils/isLoggableAttr';

const flowsConfig = {type: 'flows'};

const eventReportDetailRows = [

  {
    heading: 'Integration',
    isLoggable: true,
    value: function IntegrationName(r) {
      return useSelector(state => selectors.getEventReportIntegrationName(state, r));
    },
  },
  {
    heading: 'Stores',
    isLoggable: true,
    value: function StoreNames(r) {
      const foundFlow = useSelector(state => selectors.getAnyValidFlowFromEventReport(state, r));

      const childIntegrationsLabels = useSelector(state => selectors.getChildIntegrationLabelsTiedToFlows(state, foundFlow?._integrationId, r?._flowIds), shallowEqual);

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
    isLoggable: true,
    value: function FlowsPertainingToEventReport(r) {
      const allFlows = useSelectorMemo(
        selectors.makeResourceListSelector,
        flowsConfig
      ).resources;

      const flows = r._flowIds.map(id => allFlows.find(f => f._id === id) || { id});

      return (
        <>
          <Typography>{flows?.length} flows</Typography>
          {flows?.map(({name, id}) => (
            <Fragment key={name || id}>
              <Typography>{name || `Flow id: ${id}(Flow deleted)`}</Typography>
            </Fragment>
          ))}
        </>
      );
    },
  },
  {
    heading: 'Date range',
    isLoggable: true,
    value: function EventReportStartDate(r) {
      return <Typography> <DateTimeDisplay dateTime={r.startTime} /> -  <DateTimeDisplay dateTime={r.endTime} /></Typography>;
    },

  },

  {
    heading: 'Last run',
    isLoggable: true,
    value: function EventReportLastRun(r) {
      // check if this is the last run value
      return <DateTimeDisplay dateTime={r?.startedAt} />;
    },

  },
  {
    heading: 'Status',
    isLoggable: true,
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
      {eventReportDetailRows.map(({heading, isLoggable, value}) => (
        <ListItem key={heading} >
          <ListItemText>
            <div className={classes.listItem}><Typography className={classes.listHeading}>{heading}:</Typography>  <Typography {...isLoggableAttr(isLoggable)} className={classes.listValue}>{value(resource)}</Typography></div>
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
