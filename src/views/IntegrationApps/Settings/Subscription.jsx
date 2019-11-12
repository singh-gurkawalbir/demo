import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Fragment } from 'react';
import { Typography, Grid, Button, Divider } from '@material-ui/core';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import CeligoTable from '../../../components/CeligoTable';
import metadata from './AddonsMetadata';

const useStyles = makeStyles(theme => ({
  header: {
    background: theme.palette.background.paper,
    textAlign: 'left',
    padding: theme.spacing(1, 2),
    borderRadius: [4, 4, 0, 0],
  },
  message: {
    paddingBottom: theme.spacing(2),
    textAlign: 'left',
  },
  heading: {
    paddingBottom: theme.spacing(1),
  },
  content: {
    padding: '30px 30px 30px 0',
  },
  container: {
    padding: '0 0 30px 30px',
  },
  button: {
    margin: theme.spacing(1),
  },
  item: {
    float: 'left',
  },
  planContent: {
    margin: 0,
    lineHeight: '16px',
  },
  customisedBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1, 2),
    textAlign: 'left',
  },
  leftBlock: {
    flexBasis: '80%',
  },
}));

export default function Subscription(props) {
  const { integrationId } = props.match.params;
  const { history, match } = props;
  const { storeId, supportsMultiStore } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const license = useSelector(state =>
    selectors.integrationAppLicense(state, integrationId)
  );
  const addOnState = useSelector(state =>
    selectors.integrationAppAddOnState(state, integrationId)
  );
  const subscribedAddOns =
    addOnState &&
    addOnState.addOns &&
    addOnState.addOns.addOnLicenses &&
    addOnState.addOns.addOnLicenses.filter(model => {
      if (supportsMultiStore) {
        return model.storeId === storeId;
      }

      return true;
    });

  if (subscribedAddOns) {
    subscribedAddOns.forEach((f, i) => {
      const addon =
        addOnState &&
        addOnState.addOns &&
        addOnState.addOns.addOnMetaData &&
        addOnState.addOns.addOnMetaData.find(addOn => addOn.id === f.id);

      subscribedAddOns[i]._id = i;
      subscribedAddOns[i].integrationId = integrationId;
      subscribedAddOns[i].name = addon ? addon.name : f.id;
      subscribedAddOns[i].description = addon ? addon.description : '';
      subscribedAddOns[i].uninstallerFunction = addon
        ? addon.uninstallerFunction
        : '';
      subscribedAddOns[i].installerFunction = addon
        ? addon.installerFunction
        : '';
    });
  }

  const hasSubscribedAddOns = subscribedAddOns && subscribedAddOns.length > 0;
  const hasAddOns =
    addOnState &&
    addOnState.addOns &&
    addOnState.addOns.addOnMetaData &&
    addOnState.addOns.addOnMetaData.length > 0;
  const {
    plan,
    createdText,
    expiresText,
    upgradeText,
    upgradeRequested,
  } = license;
  const { version } = integration;
  const handleUpgrade = () => {
    if (upgradeText === 'CONTACT US TO UPGRADE') {
      dispatch(
        actions.integrationApp.settings.requestUpgrade(integration, {
          licenseId: license._id,
        })
      );
    } else {
      dispatch(actions.integrationApp.settings.upgrade(integration, license));
    }
  };

  return (
    <Fragment>
      <div>
        <div className={classes.header}>
          <Typography variant="h4">Subscription</Typography>
        </div>
        <div className={classes.content}>
          <div className={classes.planContent}>
            <Grid container className={classes.container}>
              <Grid item xs={2}>
                <Typography className={classes.item}> {plan} </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.item}>
                  {`Version ${version}`}
                </Typography>
                <Typography className={classes.item}>
                  {`Integration ID ${integrationId}`}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography className={classes.item}>{createdText}</Typography>
                <Typography className={classes.item}>{expiresText}</Typography>
              </Grid>
              <Grid item xs={3}>
                {upgradeText && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    disabled={upgradeRequested}
                    onClick={handleUpgrade}>
                    {upgradeText}
                  </Button>
                )}
              </Grid>
            </Grid>
          </div>
          <Divider />
        </div>
        <Typography className={classes.message}>
          Your subscription gives you access to install and run one instance
          (tile) of this Integration App. Contact your Account Manager for more
          info.
        </Typography>
        {hasAddOns && !hasSubscribedAddOns && (
          <div className={classes.customisedBlock}>
            <div className={classes.leftBlock}>
              <Typography variant="h4" className={classes.heading}>
                Add-Ons
              </Typography>
              <Typography className={classes.message}>
                You don`t have any add-ons yet. Add-ons let you customize
                subscription to meet your specific business requirements.
              </Typography>
            </div>
            <div>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={() =>
                  history.push(match.url.replace('subscription', 'addons'))
                }>
                GET ADD-ONS
              </Button>
            </div>
          </div>
        )}
        {hasAddOns && hasSubscribedAddOns && (
          <Fragment>
            <div className={classes.header}>
              <Typography variant="h4" className={classes.heading}>
                Add-Ons
              </Typography>
              <Typography variant="body2">
                Add-ons let you customize your subscription to meet your
                specific business requirements. They will expire when your
                Integration App subscription expires.
              </Typography>
            </div>

            <CeligoTable data={subscribedAddOns} {...metadata} />
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}
