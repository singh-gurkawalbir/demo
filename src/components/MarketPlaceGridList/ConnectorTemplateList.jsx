import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Card, CardActions, Button } from '@material-ui/core';
import { getApplicationConnectors } from '../../constants/applications';
import CeligoPageBar from '../../components/CeligoPageBar';
import * as selectors from '../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    margin: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    width: '300px',
    height: '350px',
    align: 'left',
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
            <div>
              <Typography>SmartConnector</Typography>
              <Typography>
                {connector.user &&
                  (connector.user.company ||
                    connector.user.name ||
                    connector.user.email)}
              </Typography>
            </div>
            <img
              width="100px"
              src={`https://d142hkd03ds8ug.cloudfront.net/images/marketplace/large/${
                connector.applications.length >= 2 &&
                application === connector.applications[0]
                  ? connector.applications[1]
                  : connector.applications[0]
              }.png`}
              alt={connector.name}
            />
            <Typography variant="h3">{connector.name}</Typography>
            <Typography className={classes.description}>
              {connector.description}
            </Typography>
            <CardActions disableSpacing>
              <Button variant="contained">Contact Sales</Button>
            </CardActions>
          </Card>
        ))}
        {templates.map(template => (
          <Card key={template._id} className={classes.card}>
            <div>
              <Typography>Template</Typography>
              <Typography>
                {template.user &&
                  (template.user.company ||
                    template.user.name ||
                    template.user.email)}
              </Typography>
            </div>
            <img
              width="100px"
              src={`https://d142hkd03ds8ug.cloudfront.net/images/marketplace/large/${
                template.applications.length >= 2 &&
                application === template.applications[0]
                  ? template.applications[1]
                  : template.applications[0]
              }.png`}
              alt={template.name}
            />
            <Typography variant="h3">{template.name}</Typography>
            <Typography className={classes.description}>
              {template.description}
            </Typography>
            <CardActions disableSpacing>
              <Button variant="contained">Install</Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </Fragment>
  );
}
