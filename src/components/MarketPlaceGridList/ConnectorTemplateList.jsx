import { Fragment, useState } from 'react';
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
import { CONTACT_SALES_MESSAGE } from '../../utils/messageStore';
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
  const userPreferences = useSelector(state =>
    selectors.userPreferences(state)
  );
  const sandbox = userPreferences.environment === 'sandbox';
  const connectors = useSelector(state =>
    selectors.marketPlaceConnectors(state, application, sandbox)
  );
  const templates = useSelector(state =>
    selectors.marketPlaceTemplates(state, application)
  );
  const applicationConnectors = getApplicationConnectors();
  const connector = applicationConnectors.find(c => c.id === application);
  const applicationName = connector && connector.name;
  const handleConnectorInstallClick = connector => {
    dispatch(actions.marketplace.installConnector(connector._id, sandbox));
  };

  const handleContactSalesClick = connector => {
    dispatch(actions.marketplace.contactSales(connector.name, connector._id));
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
              {connector.canInstall ? (
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
