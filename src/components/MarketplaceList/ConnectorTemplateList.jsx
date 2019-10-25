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
import applications from '../../constants/applications';
import CeligoPageBar from '../../components/CeligoPageBar';
import ConnectorTemplateContent from './ConnectorTemplateContent';
import getRoutePath from '../../utils/routePaths';
import actions from '../../actions';
import {
  CONTACT_SALES_MESSAGE,
  MULTIPLE_INSTALLS,
} from '../../utils/messageStore';
import * as selectors from '../../reducers';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import { prompt } from '../Prompt';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(300px, 1fr));`,
    gridGap: theme.spacing(2),
    '& > div': {
      maxWidth: '100%',
      minWidth: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: `repeat(1, minmax(100%, 1fr));`,
    },
    [theme.breakpoints.up('xs')]: {
      gridTemplateColumns: `repeat(auto-fill, minmax(290px, 1fr));`,
    },
  },
  card: {
    height: '318px',
    border: '1px solid',
    position: 'relative',
    borderColor: theme.palette.secondary.lightest,
    margin: '0 auto',
    borderRadius: '4px',
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
  const connector = applications.find(c => c.id === application);
  const applicationName = connector && connector.name;
  const handleConnectorInstallClick = connector => {
    if (connector.installed) {
      prompt({
        title: 'Multiple Installs',
        label: 'Tag',
        message: MULTIPLE_INSTALLS,
        buttons: [
          {
            label: 'Cancel',
          },
          {
            label: 'Install',
            onClick: tag => {
              dispatch(
                actions.marketplace.installConnector(
                  connector._id,
                  sandbox,
                  tag
                )
              );
              props.history.push(getRoutePath('/dashboard'));
            },
          },
        ],
      });
    } else {
      dispatch(actions.marketplace.installConnector(connector._id, sandbox));
      props.history.push(getRoutePath('/dashboard'));
    }
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
              <Link
                data-test="installTemplate"
                underline="none"
                key={template._id}
                to={getRoutePath(
                  `/marketplace/templates/${template._id}/preview`
                )}>
                <Button variant="text" color="primary">
                  Install <ArrowRightIcon />
                </Button>
              </Link>
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
