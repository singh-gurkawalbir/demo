import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import DynaSelect from './DynaSelect';
import DynaSelectResource from './DynaSelectResource';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { isProduction } from '../../../forms/formFactory/utils';
import { setValue } from '../../../utils/form';
import customCloneDeep from '../../../utils/customCloneDeep';

export const useLoadIClientOnce = ({ connectionId, disableLoad = false }) => {
  const iClients = useSelector(state =>
    selectors.iClients(state, connectionId)
  );
  const dispatch = useDispatch();
  const [requestedOnLoad, setRequestedOnLoad] = useState(disableLoad);

  useEffect(() => {
    if (!iClients.length && connectionId && !requestedOnLoad) {
      setRequestedOnLoad(true);
      dispatch(actions.resource.connections.requestIClients(connectionId));
    }
  }, [iClients.length, connectionId, requestedOnLoad, dispatch]);

  return { iClients };
};

export default function DynaIclient(props) {
  const { connectionId, connectorId, connType, formKey, hideFromUI, defaultValue, _httpConnectorId, onFieldChange, id, iClientConditionsMap, iClientConditions, preConfiguredFieldValue} = props;
  const { iClients } = useLoadIClientOnce({
    connectionId,
    disableLoad: !connectorId,
  });

  const fields = useSelector(state => selectors.formState(state, formKey)?.fields, shallowEqual);
  const preConfiguredValue = useMemo(() => {
    let tempField = customCloneDeep(props);

    tempField = {...tempField, _conditionIdValuesMap: iClientConditionsMap, conditions: iClientConditions};
    const newValue = setValue(tempField, fields);

    return newValue;
  }, [fields, iClientConditions, iClientConditionsMap, props]);

  const hideNew = useMemo(() => {
    if (hideFromUI) {
      return true;
    }
    if (_httpConnectorId && iClients?.length <= 1) {
      if (iClients?.length === 1) {
        // Single IA iClientId present so no need to show dropdown
        onFieldChange(id, iClients[0]._id);
      }
      if (iClients?.length <= 0 && preConfiguredValue) {
        // No IA iCLient present then calculate preconfigured field iCLientId  with conditions
        onFieldChange(id, preConfiguredValue);
      }
      if (iClients?.length <= 0 && !preConfiguredValue && preConfiguredFieldValue) {
        // No IA iCLient present then calculate preconfigured field iCLientId without conditions
        onFieldChange(id, preConfiguredFieldValue);
      }

      return true;
    }
    if (_httpConnectorId && iClients?.length > 1) {
      // multiple IA iClient present then show the drodown
      onFieldChange(id, defaultValue);
    }

    return false;
  }, [_httpConnectorId, defaultValue, hideFromUI, iClients, id, onFieldChange, preConfiguredFieldValue, preConfiguredValue]);

  return hideNew ? null : (
    <>
      {connectorId && (
        <DynaSelect
          {...props}
          options={[
            {
              items: iClients.map(i => ({
                label: i.name || i._id,
                value: i._id,
              })),
            },
          ]}
        />
      )}
      {connType !== 'ebay' &&
        (connType !== 'netsuite' || !isProduction()) &&
        !connectorId && (
        <DynaSelectResource
          addTitle="Create iClient"
          editTitle="Edit iClient"
          disabledTitle="Select an iClient to allow editing"
          {...props} />
      )}
    </>
  );
}
