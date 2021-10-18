import { Chip } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSelectorMemo } from '../../../../../hooks';
import { selectors } from '../../../../../reducers';
import LoadResources from '../../../../LoadResources';
import { useResetWhenParentIntegrationChanges } from '../hooks';
import { GenericTypeableSelect } from './GenericTypeableSelect';

const OptionCheckbox = props => {
  const {
    onClick,
    checked,
    label,
  } = props;
  const { flowGroupName } = props.data;

  return (
    <>
      <Checkbox
        onClick={onClick}
        checked={checked}
        color="primary"
      />
      <span >{label}</span>
      <span >{flowGroupName}</span>
    </>
  );
};

const SelectedValueChips = ({value, label}) => (
  <Chip
    value={value}
    label={label}
  />
);

const TypeableSelect = props => (

  <GenericTypeableSelect
    {...props}
    SelectedOptionImpl={OptionCheckbox}
    SelectedValueImpl={SelectedValueChips}
  />
);
export default function DynaFlowsTiedToIntegration(props) {
  const {formKey, id, onFieldChange} = props;

  const selectedIntegrationId = useSelector(state => selectors.formState(state, formKey)?.fields?.integration?.value);
  const childIntegrationsIds = useSelector(state => selectors.formState(state, formKey)?.fields?.childIntegrations?.value);

  const flowsTiedToIntegrations = useSelectorMemo(selectors.mkAllFlowsTiedToIntegrations, selectedIntegrationId, childIntegrationsIds);

  const { flowGroupings = [] } = useSelectorMemo(selectors.makeResourceSelector, 'integrations', selectedIntegrationId);

  // reset flows list when either integration or childIntegrations changes
  useResetWhenParentIntegrationChanges(formKey, 'integration', onFieldChange, id);
  useResetWhenParentIntegrationChanges(formKey, 'childIntegrations', onFieldChange, id);
  const options = useMemo(() => flowsTiedToIntegrations?.map(({_id, name, _flowGroupingId}) => {
    const flowGroupName = flowGroupings.find(flowGroup => flowGroup._id === _flowGroupingId)?.name;

    return { label: name, value: _id, flowGroupName};
  }), [flowGroupings, flowsTiedToIntegrations]);

  return (

    <LoadResources required resources="flows" >
      <TypeableSelect {...props} disabled={!selectedIntegrationId} options={options} />
    </LoadResources>

  );
}

