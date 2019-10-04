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
import ArrowRightIcon from '../icons/ArrowRightIcon';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(318px, 1fr));`,
    gridRowGap: theme.spacing(3),
    gridColumnGap: theme.spacing(2),
    padding: theme.spacing(3),
  },
  card: {
    height: '318px',
    width: '318px',
    borderRadius: 0,
    border: '1px solid',
    position: 'relative',
    borderColor: theme.palette.secondary.lightest,
    margin: '0 auto',
  },
  description: {
    width: '200px',
    maxHeight: '100px',
    overflowY: 'auto',
  },
  cardAction: {
    position: 'absolute',
    bottom: 10,
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
    selectors.marketplaceConnectors(state, application, sandbox)
  );
  const templates = useSelector(state =>
    selectors.marketplaceTemplates(state, application)
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
          <Card key={connector._id} className={classes.card} elevation={0}>
            <ConnectorTemplateContent
              resource={connector}
              title="SmartConnector"
              application={application}
              type="connector"
            />
            <CardActions className={classes.cardAction}>
              {connector.canInstall ? (
                <Button
                  data-test="installConnector"
                  to={getRoutePath('/integrations')}
                  component={RouterLink}
                  onClick={() => handleConnectorInstallClick(connector)}
                  variant="text"
                  color="primary">
                  Install <ArrowRightIcon />
                </Button>
              ) : (
                <Button
                  data-test="contactSales"
                  onClick={() => handleContactSalesClick(connector)}
                  variant="text"
                  color="primary">
                  Contact Sales
                </Button>
              )}
            </CardActions>
          </Card>
        ))}
        {templates.map(template => (
          <Card key={template._id} className={classes.card} elevation={0}>
            <ConnectorTemplateContent
              resource={template}
              title="Template"
              application={application}
              type="template"
            />
            <CardActions className={classes.cardAction}>
              <Button
                data-test="installTemplate"
                variant="text"
                color="primary">
                Install <ArrowRightIcon />
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
      {showMessage && (
        <Dialog open onClose={() => setShowMessage(false)}>
          <DialogContent>
            {CONTACT_SALES_MESSAGE}
            <Link
              href="http://www.celigo.com/integration-marketplace"
              target="_blank">
              http://www.celigo.com/integration-marketplace
            </Link>
          </DialogContent>
        </Dialog>
      )}
    </Fragment>
  );
}
