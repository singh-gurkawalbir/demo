import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, CardActions, Typography } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import RawHtml from '../../../../../components/RawHtml';
import PanelHeader from '../../../../../components/PanelHeader';
import { LICENSE_UPGRADE_REQUEST_RECEIVED } from '../../../../../utils/messageStore';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import ModalDialog from '../../../../../components/ModalDialog';
import {isHTML} from '../../../../../utils/string';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import AddonInstallerButton from '../Admin/sections/Subscription/AddonInstallerButton';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  addOnContainer: {
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr));',
    gridGap: theme.spacing(2),
    '& > div': {
      maxWidth: '100%',
      minWidth: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, minmax(100%, 1fr));',
    },
    [theme.breakpoints.up('xs')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr));',
    },
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
}));

export default function AddOnsPanel({ integrationId, childId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  // TODO: This integrationAppAddOnState selector doesn't actually return
  // addon state. It returns all IA settings state. This should be refactored
  // along with the code in the ../App/index file. The addon state should
  // contain a status indicating the progress of API request to retrieve addon
  // details.
  const [showMessage, setShowMessage] = useState(false);
  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);
  const supportsMultiStore = integration?.settings?.supportsMultiStore;
  const addOnState = useSelector(state =>
    selectors.integrationAppAddOnState(state, integrationId)
  );
  const subscribedAddOns = addOnState?.addOns?.addOnLicenses?.filter(model => supportsMultiStore && childId ? model.storeId === childId : true);
  const subscribedAddOn = metadata => subscribedAddOns?.find(sa => sa.id === metadata.id);
  const addOnMetadata = addOnState?.addOns?.addOnMetaData;
  const licenseId = useSelector(state => {
    const license = selectors.integrationAppLicense(state, integrationId);

    return license ? license._id : null;
  });
  const onClose = () => {
    setShowMessage(false);
  };

  const handleContactSales = useCallback(
    addOnName => {
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
      setShowMessage(true);
    },
    [dispatch, integrationId, licenseId]
  );

  return (
    <div className={classes.root}>
      <PanelHeader title="Add-ons" />

      <div className={classes.addOnContainer}>
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
                    <Button
                      data-test="contactSales"
                      onClick={() => handleContactSales(data.name)}
                      variant="outlined"
                      color="primary">
                      Contact sales
                    </Button>
                  )}
              </CardActions>
            </Card>
          ))}
      </div>
      {showMessage && (
        <ModalDialog show onClose={onClose}>
          <div>License upgrade request</div>
          <div>{LICENSE_UPGRADE_REQUEST_RECEIVED}</div>
        </ModalDialog>
      )}
    </div>
  );
}
