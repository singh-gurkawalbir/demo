import React from 'react';
import { useSelector } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import { selectors } from '../../../../../../reducers';
import RightDrawer from '../../../../../../components/drawer/Right';
import DrawerHeader from '../../../../../../components/drawer/Right/DrawerHeader';
import { drawerPaths } from '../../../../../../utils/rightDrawer';
import CeligoTable from '../../../../../../components/CeligoTable';
import metadata from '../../../../../../components/ResourceTable/trustedDevices/metadata';

const useStyles = makeStyles(theme => ({
  errorTable: {
    width: '100%',
  },
  noDevice: {
    padding: theme.spacing(3),
  },
}));

function ManageDevicesDrawerContent() {
  const classes = useStyles();
  const trustedDevices = useSelector(selectors.trustedDevices);

  if (!trustedDevices?.length) {
    return <div className={classes.noDevice}> No devices </div>;
  }

  return (
    <CeligoTable {...metadata} data={trustedDevices} className={classes.errorTable} />
  );
}

export default function ManageDevicesDrawer() {
  return (
    <RightDrawer
      path={drawerPaths.MFA.MANAGE_TRUSTED_DEVICES}
      width="small"
      height="tall">
      <DrawerHeader title="Manage devices" helpKey="mfa.manageDevices" />
      <ManageDevicesDrawerContent />
    </RightDrawer>
  );
}
