import React from 'react';
import { useHistory } from 'react-router-dom';
import ConditionalLookup from '.';
import RightDrawer from '../../../../drawer/Right';

export default function ConditionalLookupDrawer(props) {
  const history = useHistory();
  const isEdit = history.location.pathname.includes('/edit');

  return (
    <RightDrawer
      path={['conditionalLookup/edit/:lookupName', 'conditionalLookup/add']}
      height="tall"
      width="default"
      title={`${isEdit ? 'Edit' : 'Add'} Lookup`}
      variant="temporary"
      >
      <ConditionalLookup {...props} />
    </RightDrawer>
  );
}
