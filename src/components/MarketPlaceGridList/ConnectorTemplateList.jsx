import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions, Button } from '@material-ui/core';
import { getApplicationConnectors } from '../../constants/applications';
import CeligoPageBar from '../../components/CeligoPageBar';
import ConnectorTemplateContent from './ConnectorTemplateContent';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    width: '300px',
    height: '350px',
    float: 'left',
  },
  description: {
    width: '200px',
    maxHeight: '100px',
    overflowY: 'auto',
  },
}));

export default function ConnectorTemplateList(props) {
  const { match } = props;
  const { application } = match.params;
  const classes = useStyles();
  let connectors =
    useSelector(state => selectors.marketPlaceConnectors(state)) || [];
  let templates =
    useSelector(state => selectors.marketPlaceTemplates(state)) || [];

  connectors = connectors.filter(
    c => c.applications && c.applications.includes(application)
  );
  templates = templates.filter(
    t => t.applications && t.applications.includes(application)
  );
  const applicationConnectors = getApplicationConnectors();
  const connector = applicationConnectors.find(c => c.id === application);
  const applicationName = connector && connector.name;

  return (
    <Fragment>
      <CeligoPageBar title={`${applicationName} Integrations`} />
      <div className={classes.root}>
        {connectors.map(connector => (
          <Card key={connector._id} className={classes.card}>
            <ConnectorTemplateContent
              resource={connector}
              title="SmartConnector"
              application={application}
              type="connector"
            />
            <CardActions>
              <Button variant="contained">Contact Sales</Button>
            </CardActions>
          </Card>
        ))}
        {templates.map(template => (
          <Card key={template._id} className={classes.card}>
            <ConnectorTemplateContent
              resource={template}
              title="Template"
              application={application}
              type="template"
            />
            <CardActions>
              <Button variant="contained">Install</Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </Fragment>
  );
}
