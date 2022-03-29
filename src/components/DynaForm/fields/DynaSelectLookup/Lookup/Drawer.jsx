import React from 'react';
import { useHistory } from 'react-router-dom';
import Lookup from '.';
import RightDrawer from '../../../../drawer/Right';
import DrawerHeader from '../../../../drawer/Right/DrawerHeader';
import { DRAWER_URLS } from '../../../../../utils/drawerURLs';

export default function LookupDrawer(props) {
  const history = useHistory();
  // TODO @Raghu: We can have a Title component instead of parent component deciding the title
  const isEdit = history.location.pathname.includes('/lookups/edit');

  return (
    <RightDrawer
      path={DRAWER_URLS.ADD_EDIT_LOOKUP}
      height="tall"
      width="default">
      <DrawerHeader title={`${isEdit ? 'Edit' : 'Create'} lookup`} />
      <Lookup {...props} />
    </RightDrawer>
  );
}
