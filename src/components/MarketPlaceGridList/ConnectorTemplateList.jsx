import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Link,
  Card,
  CardActions,
  Button,
  Dialog,
  DialogContent,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { getApplicationConnectors } from '../../constants/applications';
import CeligoPageBar from '../../components/CeligoPageBar';
import ConnectorTemplateContent from './ConnectorTemplateContent';
import getRoutePath from '../../utils/routePaths';
import actions from '../../actions';
import { CONTACT_SALES_MESSAGE } from '../../utils/constants';
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
  const dispatch = useDispatch();
  const [showMessage, setShowMessage] = useState(false);
  let connectors = useSelector(state => selectors.marketPlaceConnectors(state));
  let templates = useSelector(state => selectors.marketPlaceTemplates(state));
  const licenses = useSelector(state => selectors.licenses(state));
  const userPreferences = useSelector(state =>
    selectors.userPreferences(state)
  );
  const sandbox = userPreferences.environment === 'sandbox';

  connectors = connectors.filter(
    c => c.applications && c.applications.includes(application)
  );
  templates = templates.filter(
    t => t.applications && t.applications.includes(application)
  );
  const applicationConnectors = getApplicationConnectors();
  const connector = applicationConnectors.find(c => c.id === application);
  const applicationName = connector && connector.name;
  const canInstallConnector = connector => {
    let hasLicense = false;

    licenses.forEach(l => {
      if (
        !l.hasExpired &&
        l.type === 'connector' &&
        l._connectorId === connector._id &&
        !l._integrationId &&
        !!l.sandbox === sandbox
      ) {
        hasLicense = true;
      }
    });

    return hasLicense;
  };

  const handleConnectorInstallClick = connector => {
    dispatch(actions.marketPlace.installConnector(connector._id, sandbox));
  };

  const handleContactSalesClick = connector => {
    dispatch(actions.marketPlace.contactSales(connector.name, connector._id));
    setShowMessage(true);
  };

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
              {canInstallConnector(connector) ? (
                <Button
                  to={getRoutePath('/integrations')}
                  component={RouterLink}
                  onClick={() => handleConnectorInstallClick(connector)}
                  variant="contained">
                  Install
                </Button>
              ) : (
                <Button
                  onClick={() => handleContactSalesClick(connector)}
                  variant="contained">
                  Contact Sales
                </Button>
              )}
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
      {showMessage && (
        <Dialog open onClose={() => setShowMessage(false)}>
          <DialogContent>
            {CONTACT_SALES_MESSAGE}
            <Link href="http://www.celigo.com/integration-marketplace">
              http://www.celigo.com/integration-marketplace
            </Link>
          </DialogContent>
        </Dialog>
      )}
    </Fragment>
  );
}
