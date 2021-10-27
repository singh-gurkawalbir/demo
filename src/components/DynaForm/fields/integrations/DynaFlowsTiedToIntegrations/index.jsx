import { Chip, makeStyles } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { components } from 'react-select';
import { useSelectorMemo } from '../../../../../hooks';
import { selectors } from '../../../../../reducers';
import ArrowDownIcon from '../../../../icons/ArrowDownIcon';
import LoadResources from '../../../../LoadResources';
import { useResetWhenParentIntegrationChanges } from '../hooks';
import { GenericTypeableSelect } from './GenericTypeableSelect';

const useStyles = makeStyles({
  optionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  optionLabel: {
    flex: 1,
  },
  optionFlowGroupName: {
    width: 100,
  },
});

const OptionCheckbox = props => {
  const classes = useStyles();
  const {
    onClick,
    checked,
    label,
  } = props;
  const { flowGroupName } = props.data;

  return (
    <div className={classes.optionContainer}>
      <Checkbox
        onClick={onClick}
        checked={checked}
        color="primary"
      />
      <span className={classes.optionLabel}>{label}</span>
      <span className={classes.optionFlowGroupName}>{flowGroupName}</span>
    </div>
  );
};

const SelectedValueChips = ({value, label}) => (
  <Chip
    value={value}
    label={label}
  />
);

const MenuListImpl = props => {
  const {children} = props;

  return (
    <>
      <components.MenuList {...props}>
        {children}
      </components.MenuList>
    </>
  );
};

const DropdownIndicator = props => (
  <components.DropdownIndicator {...props}>
    <ArrowDownIcon />
  </components.DropdownIndicator>
);

const TypeableSelect = props => {
  const { isFlowGroupForm } = props;

  return isFlowGroupForm ? (
    <GenericTypeableSelect
      {...props}
      SelectedOptionImpl={OptionCheckbox}
      SelectedValueImpl={SelectedValueChips}
      dropdownIndicator={DropdownIndicator}
      menuListImpl={MenuListImpl}
    />
  ) : (
    <GenericTypeableSelect
      {...props}
      SelectedOptionImpl={OptionCheckbox}
      SelectedValueImpl={SelectedValueChips}
    />
  );
};
export default function DynaFlowsTiedToIntegration(props) {
  const {formKey, id, onFieldChange, isFlowGroupForm} = props;

  const selectedIntegrationId = useSelector(state => selectors.formState(state, formKey)?.fields?.integration?.value);
  const childIntegrationsIds = useSelector(state => selectors.formState(state, formKey)?.fields?.childIntegrations?.value);

  const flowsTiedToIntegrations = useSelectorMemo(selectors.mkAllFlowsTiedToIntegrations, selectedIntegrationId, childIntegrationsIds);

  const { flowGroupings } = useSelectorMemo(selectors.makeResourceSelector, 'integrations', selectedIntegrationId) || [];

  // reset flows list when either integration or childIntegrations changes
  useResetWhenParentIntegrationChanges(formKey, 'integration', onFieldChange, id);
  useResetWhenParentIntegrationChanges(formKey, 'childIntegrations', onFieldChange, id);
  const options = useMemo(() => flowsTiedToIntegrations?.map(({_id, name, _flowGroupingId}) => {
    const flowGroupName = isFlowGroupForm ? flowGroupings?.find(flowGroup => flowGroup._id === _flowGroupingId)?.name : '';

    return { label: name, value: _id, flowGroupName};
  }), [flowGroupings, flowsTiedToIntegrations, isFlowGroupForm]);

  return (

    <LoadResources required resources="flows" >
      <TypeableSelect {...props} disabled={!selectedIntegrationId} options={options} />
    </LoadResources>

  );
}

