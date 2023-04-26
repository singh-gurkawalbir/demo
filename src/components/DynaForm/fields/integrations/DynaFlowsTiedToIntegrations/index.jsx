import { Chip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Checkbox from '@mui/material/Checkbox';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { components } from 'react-select';
import { useSelectorMemo } from '../../../../../hooks';
import { selectors } from '../../../../../reducers';
import { UNASSIGNED_SECTION_NAME } from '../../../../../constants';
import ArrowDownIcon from '../../../../icons/ArrowDownIcon';
import LoadResources from '../../../../LoadResources';
import { useResetWhenParentIntegrationChanges } from '../hooks';
import { GenericTypeableSelect } from './GenericTypeableSelect';

const useStyles = makeStyles(theme => ({
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
  optionFlowGroupUnassigned: {
    fontStyle: 'italic',
  },
  optionCheckbox: {
    padding: theme.spacing(1),
  },
}));

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
        className={classes.optionCheckbox}
      />
      <span className={classes.optionLabel}>{label}</span>
      <span className={clsx(classes.optionFlowGroupName, flowGroupName === UNASSIGNED_SECTION_NAME ? classes.optionFlowGroupUnassigned : '')}>
        {flowGroupName}
      </span>
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

  return (
    <GenericTypeableSelect
      {...props}
      SelectedOptionImpl={OptionCheckbox}
      SelectedValueImpl={SelectedValueChips}
      {...(isFlowGroupForm ? { dropdownIndicator: DropdownIndicator, menuListImpl: MenuListImpl} : {})}
      defaultMenuIsOpen={isFlowGroupForm}
    />
  );
};
export default function DynaFlowsTiedToIntegration(props) {
  const {formKey, id, onFieldChange, isFlowGroupForm, integrationId} = props;

  const selectedIntegrationId = useSelector(state => selectors.formState(state, formKey)?.fields?.integration?.value);
  const childIntegrationsIds = useSelector(state => selectors.formState(state, formKey)?.fields?.childIntegrations?.value);

  const flowsTiedToIntegrations = useSelectorMemo(selectors.mkAllFlowsTiedToIntegrations, selectedIntegrationId || integrationId, childIntegrationsIds);

  const flowGroupings = useSelectorMemo(selectors.mkFlowGroupingsTiedToIntegrations, selectedIntegrationId || integrationId);

  // reset flows list when either integration or childIntegrations changes
  useResetWhenParentIntegrationChanges(formKey, 'integration', onFieldChange, id);
  useResetWhenParentIntegrationChanges(formKey, 'childIntegrations', onFieldChange, id);
  const options = useMemo(() => {
    if (isFlowGroupForm) {
      const flowOptions = [];

      // the flows should be in the same order as the flowGroups in flowGroupings
      // should add flow Group name to the options in case of create or edit flow group forms
      flowGroupings.forEach(flowGroup => {
        flowsTiedToIntegrations.forEach(flow => {
          if (flow._flowGroupingId === flowGroup._id) {
            flowOptions.push({
              label: flow.name,
              value: flow._id,
              flowGroupName: flowGroup.name,
            });
          }
        });
      });

      flowsTiedToIntegrations.forEach(flow => {
        if (!flow._flowGroupingId) {
          flowOptions.push({
            label: flow.name,
            value: flow._id,
            flowGroupName: UNASSIGNED_SECTION_NAME,
          });
        }
      });

      return flowOptions.map(item => ({ ...item, label: item.label || `Unnamed (id: ${item.value})` }));
    }

    return flowsTiedToIntegrations?.map(({_id, name}) => ({ label: name || `Unnamed (id: ${_id})`, value: _id}));
  }, [flowGroupings, flowsTiedToIntegrations, isFlowGroupForm]);

  return (

    <LoadResources required integrationId={integrationId} resources="flows" >
      <TypeableSelect {...props} disabled={!(selectedIntegrationId || integrationId)} options={options} />
    </LoadResources>

  );
}

