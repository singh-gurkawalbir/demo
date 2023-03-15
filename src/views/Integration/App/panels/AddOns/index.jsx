import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardActions, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import RawHtml from '../../../../../components/RawHtml';
import PanelHeader from '../../../../../components/PanelHeader';
import messageStore, {message} from '../../../../../utils/messageStore';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import {isHTML} from '../../../../../utils/string';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import AddonInstallerButton from '../Admin/sections/Subscription/AddonInstallerButton';
import FilledButton from '../../../../../components/Buttons/FilledButton';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import useConfirmDialog from '../../../../../components/ConfirmDialog';
import {gridViewStyles} from '../../../../Home/View/TileView/HomeCard';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  card: {
    height: '318px',
    border: '1px solid',
    position: 'relative',
    borderColor: theme.palette.secondary.lightest,
    margin: '0 auto',
    borderRadius: '4px',
    padding: theme.spacing(2),
    textAlign: 'left',
  },
  header: {
    marginBottom: theme.spacing(2),
    '&:before': {
      content: '""',
      width: '100%',
      height: 6,
      background: theme.palette.primary.dark,
      position: 'absolute',
      top: 0,
      left: 0,
    },
  },
  description: {
    minHeight: '160px',
    maxHeight: '175px',
    overflowY: 'auto',
    paddingRight: theme.spacing(2),
    wordBreak: 'break-word',
  },
  cardAction: {
    position: 'absolute',
    bottom: 10,
    paddingLeft: 0,
  },
  addOnContainer: {
    padding: theme.spacing(0, 2, 2),
  },
}));

export default function AddOnsPanel({ integrationId, childId }) {
  const classes = useStyles();
  const gridViewClasses = gridViewStyles();
  const dispatch = useDispatch();
  // TODO: This integrationAppAddOnState selector doesn't actually return
  // addon state. It returns all IA settings state. This should be refactored
  // along with the code in the ../App/index file. The addon state should
  // contain a status indicating the progress of API request to retrieve addon
  // details.
  const [enquesnackbar] = useEnqueueSnackbar();
  const {confirmDialog} = useConfirmDialog();
  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);
  const supportsMultiStore = integration?.settings?.supportsMultiStore;
  const addOnState = useSelector(state =>
    selectors.integrationAppAddOnState(state, integrationId)
  );
  const subscribedAddOns = useSelector(state =>
    selectors.subscribedAddOns(state, integrationId, supportsMultiStore, childId)
  );

  const subscribedAddOn = metadata => subscribedAddOns?.find(sa => sa.id === metadata.id);
  const addOnMetadata = addOnState?.addOns?.addOnMetaData;
  const licenseId = useSelector(state => {
    const license = selectors.integrationAppLicense(state, integrationId);

    return license ? license._id : null;
  });

  const handleContactSales = useCallback(
    addOnName => () => {
      // TODO: what kind of crazy logic is going on here?
      // the integrationApp requestUpgrade action requires its own
      // licensing information sent to it? plus the full integration resource?
      // All of this is accessible via a passing only "integrationId" and "addOnName"
      // What do we have application state for then? Here we fetch data from the
      // state only to sent it right back into the data-layer.
      dispatch(
        actions.integrationApp.settings.requestUpgrade(integrationId, {
          addOnName,
          licenseId,
        })
      );

      enquesnackbar({message: <RawHtml html={messageStore('SUBSCRIPTION.LICENSE_UPGRADE_SUCCESS_MESSAGE')} />, variant: 'success'});
    },

    [dispatch, enquesnackbar, integrationId, licenseId]
  );
  const onRequestAddonClicked = data => () => {
    const addonName = data?.name;

    confirmDialog({
      title: 'Request add-on',
      message: message.SUBSCRIPTION.LICENSE_UPGRADE_REQUEST,
      buttons: [
        {label: 'Submit request', onClick: handleContactSales(addonName)},
        {label: 'Cancel', variant: 'text'},
      ],
    });
  };

  return (
    <div className={classes.root}>
      <PanelHeader title="Add-ons" />

      <div className={clsx(gridViewClasses.container, classes.addOnContainer)}>
        {addOnMetadata &&
          addOnMetadata.map(data => (
            <Card key={data.id} className={classes.card} elevation={0}>
              <div className={classes.header}>
                <Typography variant="h4">{data.name}</Typography>
              </div>
              <Typography variant="body2" className={classes.description}>{isHTML(data.description) ? <RawHtml html={data.description} /> : data.description}</Typography>
              <CardActions className={classes.cardAction}>
                { subscribedAddOn(data)
                  ? <AddonInstallerButton size="medium" resource={subscribedAddOn(data)} />
                  : (
                    <FilledButton
                      data-test="contactSales"
                      onClick={onRequestAddonClicked(data)}>
                      Request add-on
                    </FilledButton>
                  )}
              </CardActions>
            </Card>
          ))}
      </div>

    </div>
  );
}
