import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { Button, Grid, Divider, Typography } from '@material-ui/core';
import PanelHeader from '../../../../../../../components/PanelHeader';
import actions from '../../../../../../../actions';
import { selectors } from '../../../../../../../reducers';
import CeligoTable from '../../../../../../../components/CeligoTable';
import AddonInstallerButton from './AddonInstallerButton';
import InfoIconButton from '../../../../../../../components/InfoIconButton';
import useSelectorMemo from '../../../../../../../hooks/selectors/useSelectorMemo';
import { useGetTableContext } from '../../../../../../../components/CeligoTable/TableContext';
import FilledButton from '../../../../../../../components/Buttons/FilledButton';

const emptyObject = {};
const metadata = {
  useColumns: () => {
    const { supportsChild, childId, children } = useGetTableContext();

    let columns = [
      {
        key: 'name',
        heading: 'Name',
        Value: ({rowData: r}) => (
          <>
            {r && r.name}
            <InfoIconButton info={r.description} size="xs" />
          </>
        ),
      },
      {
        key: 'child',
        heading: 'Child',
        Value: ({rowData: r}) => children.find(c => c._id === r.childId)?.label || r.childId,
      },
      {
        key: 'installedOn',
        heading: 'Installed on',
        Value: ({rowData: r}) => r.installedOn ? moment(r.installedOn).format('MMM D, YYYY') : '',
      },
      {
        key: 'action',
        heading: 'Action',
        Value: ({rowData: r}) => <AddonInstallerButton resource={r} />,
      },
    ];

    if (!supportsChild || childId) {
      columns = columns.filter(c => c.heading !== 'Child');
    }

    return columns;
  },
};
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
    paddingLeft: theme.spacing(2),
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

export default function SubscriptionSection({ childId, integrationId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const {
    supportsChild,
    version,
  } = useSelector(state => {
    const integration = selectors.integrationAppSettings(state, integrationId);

    if (integration) {
      return {
        supportsChild: !!(integration.initChild && integration.initChild.function),
        version: integration.version,
      };
    }

    return emptyObject;
  }, shallowEqual);
  const children = useSelectorMemo(selectors.mkIntegrationChildren, integrationId);
  const license = useSelector(state =>
    selectors.integrationAppLicense(state, integrationId)
  );
  const plan = useSelector(state =>
    selectors.integrationAppEdition(state, integrationId)
  );
  const addOnState = useSelector(state =>
    selectors.integrationAppAddOnState(state, integrationId)
  );
  const subscribedAddOns =
    addOnState &&
    addOnState.addOns &&
    addOnState.addOns.addOnLicenses &&
    addOnState.addOns.addOnLicenses.filter(model => {
      if (supportsChild) {
        return childId ? model.childId === childId : true;
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
    createdText,
    expiresText,
    upgradeText,
    upgradeRequested,
  } = license;
  const handleUpgrade = () => {
    if (upgradeText === 'CONTACT US TO UPGRADE') {
      dispatch(
        actions.integrationApp.settings.requestUpgrade(integrationId, {
          licenseId: license._id,
        })
      );
    } else {
      dispatch(actions.integrationApp.settings.upgrade(integrationId, license));
    }
  };

  return (
    <>
      <PanelHeader title="Subscription details" />
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.planContent}>
            <Grid container className={classes.container}>
              <Grid item xs={2}>
                <Typography data-test="iaPlan" className={classes.item}>
                  {' '}
                  {plan}{' '}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography data-test="iaVersion" className={classes.item}>
                  {`Version ${version}`}
                </Typography>
                <Typography data-test="integrationId" className={classes.item}>
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
                Add-ons
              </Typography>
              <Typography className={classes.message}>
                You don`t have any add-ons yet. Add-ons let you customize
                subscription to meet your specific business requirements.
              </Typography>
            </div>
            <div>
              <FilledButton
                className={classes.button}
                component={Link}
                to={match.url.replace('admin/subscription', 'addons')}>
                GET ADD-ONS
              </FilledButton>
            </div>
          </div>
        )}
        {hasAddOns && hasSubscribedAddOns && (
          <>
            <div className={classes.header}>
              <Typography variant="h4" className={classes.heading}>
                Add-ons
              </Typography>
              <Typography variant="body2">
                Add-ons let you customize your subscription to meet your
                specific business requirements. They will expire when your
                Integration App subscription expires.
              </Typography>
            </div>

            <CeligoTable data={subscribedAddOns} {...metadata} actionProps={{ supportsChild, children }} />
          </>
        )}
      </div>
    </>
  );
}
