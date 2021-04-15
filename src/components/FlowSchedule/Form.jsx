import React from 'react';
import { useSelector } from 'react-redux';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import { selectors } from '../../reducers';
import DynaForm from '../DynaForm';
import {
  getMetadata,
  getScheduleStartMinute,
  setValues,
} from './util';

export default function FlowScheduleForm({
  formKey,
  flow,
  disabled,
  pg,
  index,
}) {
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', flow?._integrationId)
  );
  const exp = useSelector(state =>
    selectors.resource(state, 'exports', pg && pg._exportId)
  );
  let resource = pg || flow;
  const schedule = pg?.schedule || flow?.schedule;
  const scheduleStartMinute = getScheduleStartMinute(exp || flow, preferences);

  const resourceIdentifier = pg?._exportId ? 'pagegenerator' : 'flow';

  resource = setValues(resource, schedule, scheduleStartMinute, flow, index, resourceIdentifier);

  if (resource && !resource.frequency) {
    resource.frequency = '';
  }

  const fieldMeta = getMetadata({
    resource,
    integration,
    preferences,
    flow,
    schedule,
    scheduleStartMinute,
    resourceIdentifier,
  });

  useFormInitWithPermissions({
    formKey,
    integrationId: flow?._integrationId,
    resourceType: 'flows',
    resourceId: flow?._id,
    disabled,
    fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
  });

  return <DynaForm formKey={formKey} />;
}
