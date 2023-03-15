import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../../../reducers';
import RightDrawer from '../../../../../../components/drawer/Right';
import DrawerHeader from '../../../../../../components/drawer/Right/DrawerHeader';
import { drawerPaths } from '../../../../../../utils/rightDrawer';
import CeligoTable from '../../../../../../components/CeligoTable';
import metadata from '../../../../../../components/ResourceTable/trustedDevices/metadata';
import customCloneDeep from '../../../../../../utils/customCloneDeep';

const useStyles = makeStyles(() => ({
  errorTable: {
    width: '100%',
  },
}));

function ManageDevicesDrawerContent({ parentUrl }) {
  const classes = useStyles();
  const history = useHistory();
  const trustedDevices = useSelector(selectors.trustedDevices);

  if (!trustedDevices?.length) {
    history.replace(parentUrl);

    return null;
  }

  return (
    <CeligoTable {...metadata} data={customCloneDeep(trustedDevices)} className={classes.errorTable} />
  );
}

export default function ManageDevicesDrawer() {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path={drawerPaths.MFA.MANAGE_TRUSTED_DEVICES}
      width="small"
      height="tall">
      <DrawerHeader title="Manage devices" />
      <ManageDevicesDrawerContent parentUrl={match.url} />
    </RightDrawer>
  );
}
