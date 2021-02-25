import React from 'react';
import { useSelector } from 'react-redux';
import {selectors} from '../../reducers';
import LoadResources from '../LoadResources';
import RightDrawer from '../drawer/Right';
import DrawerHeader from '../drawer/Right/DrawerHeader';
import ResponseMappingWrapper from '.';

export default function ResponseMappingDrawer({integrationId}) {
  const helpKey = useSelector(state => {
    const {resourceType} = selectors.responseMapping(state);

    if (!resourceType) {
      return '';
    }

    return resourceType === 'exports' ? 'lookup.response.mapping' : 'import.response.mapping';
  });

  return (
    <LoadResources
      required="true"
      resources="imports, exports, connections">
      <RightDrawer
        path={[
          'responseMapping/:flowId/:resourceId',
        ]}
        height="tall"
        width="default"
        variant="persistent"
        >
        <DrawerHeader
          title="Define response mapping"
          helpKey={helpKey}
        />
        <ResponseMappingWrapper
          integrationId={integrationId}
        />
      </RightDrawer>
    </LoadResources>
  );
}
