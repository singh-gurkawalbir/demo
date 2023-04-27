import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DynaSelect from '../DynaSelect';
import { selectors } from '../../../../reducers';
import { destinationOptions, sourceOptions } from '../../../../forms/formFactory/utils';

const webhookOnlyOptions = [
  {
    label: 'Listen for real-time data from source application',
    value: 'webhook',
  },
];

const webhookAssistantOptions = [
  {
    label: 'Export records from source application',
    value: 'exportRecords',
  },
  {
    label: 'Listen for real-time data from source application',
    value: 'webhook',
  },
];
const importOption = [
  {
    label: 'Import records into destination application',
    value: 'importRecords',
  },
];
const lookupOption = [
  {
    label: 'Look up additional files (per record)',
    value: 'lookupFiles',
  },
];

/**
 * @param { Object } application : Details of selected application
 * @param { String } mode : source/destination
 * @param { Boolean } isDataloader
 * This function handles what to show as resource type options based on application
 */
function getAvailableResourceTypeOptions(application, mode, isDataloader) {
  const { type, assistant, webhook, webhookOnly, _httpConnectorId, name } =
    application || {};

  // Defensive code to avoid unknown issues
  if (!application || !mode) return [];
  // fetches map of options against application type based on mode: source/destination
  const optionsMap = mode === 'source' ? sourceOptions : destinationOptions;

  // Incase of Data loader , mode: destination should show only import as a default option
  if (mode === 'destination' && isDataloader) return importOption;
  // fetches options specific to selected application
  const possibleOptions = optionsMap[(_httpConnectorId ? name : assistant) || type];

  if (possibleOptions) return possibleOptions;
  if (mode === 'source' && webhookOnly) {
    return webhookOnlyOptions;
  }

  // Incase of a webhook assistant
  if (mode === 'source' && (assistant || _httpConnectorId) && webhook) {
    return webhookAssistantOptions;
  }

  if (mode === 'destination' && type === 'netsuitejdbc') {
    return lookupOption;
  }

  // If it passes none of the above cases, show common options
  return optionsMap.common || [];
}

export default function DynaSelectResourceType(props) {
  const { options = {}, mode, flowId, ...rest } = props;
  const { id, onFieldChange } = rest;
  const isDataloader = useSelector(state => selectors.isDataLoader(state, flowId));
  const availableOptions = useMemo(
    () =>
      getAvailableResourceTypeOptions(
        options.selectedApplication,
        mode,
        isDataloader
      ),
    [isDataloader, mode, options.selectedApplication]
  );
  const resourceTypeOptions = useMemo(
    () => [
      {
        items: availableOptions,
      },
    ],
    [availableOptions]
  );

  useEffect(() => {
    if (options.selectedApplication) {
      const defaultValue =
        availableOptions.length === 1 ? availableOptions[0].value : '';

      onFieldChange(id, defaultValue, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.selectedApplication]);

  return (
    <DynaSelect
      {...rest}
      options={resourceTypeOptions}
      disabled={availableOptions.length === 1}
    />
  );
}
