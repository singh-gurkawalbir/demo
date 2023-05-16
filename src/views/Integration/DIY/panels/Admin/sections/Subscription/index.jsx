import React, { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import { Grid, Divider, Typography } from '@mui/material';
import { FilledButton } from '@celigo/fuse-ui';
import PanelHeader from '../../../../../../../components/PanelHeader';
import actions from '../../../../../../../actions';
import { selectors } from '../../../../../../../reducers';
import CeligoTable from '../../../../../../../components/CeligoTable';
import AddonInstallerButton from './AddonInstallerButton';
import InfoIconButton from '../../../../../../../components/InfoIconButton';
import useSelectorMemo from '../../../../../../../hooks/selectors/useSelectorMemo';
import { useGetTableContext } from '../../../../../../../components/CeligoTable/TableContext';
import useConfirmDialog from '../../../../../../../components/ConfirmDialog';
import ChildIntegrationsTable from './ChildIntegrationsTable';
import UpgradeDrawer from '../../../../../App/drawers/Upgrade';
import RequestUpgradeButton from './RequestUpgradeButton';
import LoadResources from '../../../../../../../components/LoadResources';
import messageStore, { message } from '../../../../../../../utils/messageStore';

const emptyObject = {};
const metadata = {
  useColumns: () => {
    const { supportsChild, childId, children } = useGetTableContext();

    const dateFormat = useSelector(state => selectors.userProfilePreferencesProps(state)?.dateFormat);
    let columns = [
      {
        key: 'name',
        heading: 'Name',
        isLoggable: true,
        Value: ({rowData: r}) => (
          <>
            {r && r.name}
            <InfoIconButton
              info={r.description}
              escapeUnsecuredDomains
              size="xs"
              title={r?.name}
            />
          </>
        ),
      },
      {
        key: 'child',
        heading: 'Child',
        isLoggable: true,
        Value: ({rowData: r}) => children.find(c => c._id === r.childId)?.label || r.childId,
      },
      {
        key: 'installedOn',
        heading: 'Installed on',
        Value: ({rowData: r}) => r.installedOn ? moment(r.installedOn).format(dateFormat || 'MMM D, YYYY') : '',
        isLoggable: true,
      },
      {
        key: 'action',
        heading: 'Action',
        isLoggable: true,
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
    padding: theme.spacing(2, 0),
  },
  container: {
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
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
  const {confirmDialog} = useConfirmDialog();
  const match = useRouteMatch();
  const {
    supportsChild,
    version,
    changeEditionSteps = [],
  } = useSelector(state => {
    const integration = selectors.integrationAppSettings(state, integrationId);

    if (integration) {
      return {
        supportsChild: !!(integration.initChild && integration.initChild.function),
        version: integration.version,
        changeEditionSteps: integration?.changeEditionSteps,
      };
    }

    return emptyObject;
  }, shallowEqual);

  const children = useSelectorMemo(selectors.mkIntegrationChildren, integrationId);
  const allChildIntegrations = useSelectorMemo(selectors.mkGetChildIntegrations, integrationId);
  const license = useSelector(state =>
    selectors.integrationAppLicense(state, integrationId)
  );
  const plan = useSelector(state =>
    selectors.integrationAppEdition(state, integrationId)
  );
  const istwoDotZeroFrameWork = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));
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

  let subscribedAddOnsModified;

  if (subscribedAddOns) {
    subscribedAddOnsModified = subscribedAddOns.map((f, i) => {
      const addon = addOnState?.addOns?.addOnMetaData?.find(addOn => addOn.id === f.id);
      const addOnObj = {...f};

      addOnObj._id = i;
      addOnObj.integrationId = integrationId;
      addOnObj.name = addon ? addon.name : f.id;
      addOnObj.description = addon ? addon.description : '';
      addOnObj.uninstallerFunction = addon
        ? addon.uninstallerFunction
        : '';
      addOnObj.installerFunction = addon
        ? addon.installerFunction
        : '';

      return addOnObj;
    });
  }

  const hasSubscribedAddOns = subscribedAddOnsModified && subscribedAddOnsModified.length > 0;
  const isLicenseExpired = useSelector(state => selectors.isIntegrationAppLicenseExpired(state, integrationId));

  const hasAddOns =
    addOnState &&
    addOnState.addOns &&
    addOnState.addOns.addOnMetaData &&
    addOnState.addOns.addOnMetaData.length > 0;
  const {
    createdText,
    expiresText,
    upgradeText,
    nextPlan,
  } = license;
  const handleUpgrade = () => {
    if (upgradeText === 'Request upgrade') {
      confirmDialog({
        title: 'Request upgrade',
        message: istwoDotZeroFrameWork ? messageStore('SUBSCRIPTION.RECEIVE_FOLLOW_UP_EMAIL') : messageStore('SUBSCRIPTION.CONTACT_FOR_BUSINESS_NEEDS', {plan: 'ideal'}),
        buttons: [
          {
            label: 'Submit request',
            dataTest: 'submitRequest',
            onClick: () => {
              dispatch(
                actions.integrationApp.settings.requestUpgrade(integrationId, {
                  licenseId: license._id,
                })
              );
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    } else {
      dispatch(actions.integrationApp.settings.upgrade(integrationId, license));
    }
  };

  const handleUpgradeEdition = useCallback(() => {
    confirmDialog({
      title: 'Upgrade plan',
      message: messageStore('SUBSCRIPTION.UPGRADE_TO_NEXT_PLAN', {nextPlan}),
      buttons: [
        {
          label: 'Continue',
          dataTest: 'continueUpgrade',
          onClick: () => {
            if (changeEditionSteps?.length) {
              dispatch(actions.integrationApp.upgrade.getSteps(integrationId));
            } else {
              dispatch(actions.integrationApp.settings.integrationAppV2.upgrade(integrationId));
            }
          },
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, dispatch, integrationId, nextPlan, changeEditionSteps?.length]);

  return (
    <>
      <PanelHeader title="Subscription details" />
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.planContent}>
            <Grid container className={classes.container}>
              <Grid item xs={2}>
                <Typography data-test="iaPlan">
                  {' '}
                  {plan}{' '}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography data-test="iaVersion">
                  {`Version ${version}`}
                </Typography>
                <Typography data-test="integrationId">
                  {`Integration ID ${integrationId}`}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography>{createdText}</Typography>
                <Typography>{expiresText}</Typography>
              </Grid>
              <Grid item xs={3}>
                <RequestUpgradeButton
                  id={integrationId}
                  license={license}
                  isLicenseExpired={isLicenseExpired}
                  istwoDotZeroFrameWork={istwoDotZeroFrameWork}
                  handleUpgrade={handleUpgrade}
                  handleUpgradeEdition={handleUpgradeEdition}
                  childIntegrationsCount={allChildIntegrations?.length}
                />
              </Grid>
            </Grid>
          </div>
          <Divider />
        </div>
        <Typography className={classes.message}>
          {message.SUBSCRIPTION.CONTACT_ACCOUNT_MANAGER}
        </Typography>
        <LoadResources required integrationId={integrationId} resources="integrations">
          {allChildIntegrations.length ? (
            <ChildIntegrationsTable
              integrationId={integrationId}
              allChildIntegrations={allChildIntegrations}
          />
          ) : null}
        </LoadResources>
        {hasAddOns && !hasSubscribedAddOns && (
          <div className={classes.customisedBlock}>
            <div className={classes.leftBlock}>
              <Typography variant="h4" className={classes.heading}>
                Add-ons
              </Typography>
              <Typography className={classes.message}>
                {message.ADDONS.NOT_EXIST}
              </Typography>
            </div>
            <div>
              <FilledButton
                sx={{mr: 1}}
                component={Link}
                disabled={isLicenseExpired}
                to={match.url.replace('admin/subscription', 'addons')}>
                Get add-ons
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
                {message.ADDONS.CUSTOMIZE}
              </Typography>
            </div>

            <CeligoTable data={subscribedAddOnsModified} {...metadata} actionProps={{ supportsChild, children }} />
          </>
        )}
      </div>
      <UpgradeDrawer id={integrationId} />
    </>
  );
}
