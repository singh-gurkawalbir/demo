import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
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
    paddingTop: theme.spacing(8),
    paddingLeft: theme.spacing(4),
    width: '300px',
    height: '400px',
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
                  (connector.user.company || connector.user.name)}
              </Typography>
            </div>
          </Card>
        ))}
        {templates.map(template => (
          <Card key={template._id} className={classes.card}>
            <div>
              <Typography>Template</Typography>
              <Typography>
                {template.user && (template.user.company || template.user.name)}
              </Typography>
            </div>
          </Card>
        ))}
      </div>
    </Fragment>
  );
}
