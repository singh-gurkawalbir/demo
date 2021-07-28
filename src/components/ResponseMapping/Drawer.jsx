import React from 'react';
import { useSelector } from 'react-redux';
import {selectors} from '../../reducers';
import LoadResources from '../LoadResources';
import RightDrawer from '../drawer/Right';
import DrawerHeader from '../drawer/Right/DrawerHeader';
import ResponseMappingWrapper from '.';
import useFormOnCancelContext from '../FormOnCancelContext';

export const responseMappingsFormKey = 'responseMappings';

export default function ResponseMappingDrawer({integrationId}) {
  const resourceType = useSelector(state => selectors.responseMapping(state).resourceType);
  const helpKey = resourceType === 'exports' ? 'lookup.response.mapping' : 'import.response.mapping';
  const mappingType = resourceType === 'exports' ? 'results' : 'response';
  const disabled = useSelector(
    state => selectors.responseMappingSaveStatus(state).saveInProgress
  );

  const {setCancelTriggered} = useFormOnCancelContext(responseMappingsFormKey);

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
          title={`Define ${mappingType} mapping`}
          helpKey={helpKey}
          disableClose={disabled}
          handleClose={setCancelTriggered}
        />
        <ResponseMappingWrapper
          integrationId={integrationId}
        />
      </RightDrawer>
    </LoadResources>
  );
}
