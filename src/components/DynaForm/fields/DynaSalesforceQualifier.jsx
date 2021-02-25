import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormControl, FormLabel } from '@material-ui/core';
import SalesforceEditorDrawer from '../../AFE/SalesforceQualificationCriteriaEditor/Drawer';
import ActionButton from '../../ActionButton';
import FilterIcon from '../../icons/FilterIcon';
import FieldMessage from './FieldMessage';
import FieldHelp from '../FieldHelp';
import usePushRightDrawer from '../../../hooks/usePushRightDrawer';

const useStyles = makeStyles(theme => ({
  salesforceFormControl: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
  },
  exitButtonSalesforceQualifier: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
  },
  dynaSalesforceQualifierWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  textField: {
    width: '100%',
  },
  salesforceQualifierLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
}));

export default function DynaSalesforceQualifier(props) {
  const classes = useStyles();
  const {
    // disabled,
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder,
    required,
    value,
    resourceId,
    flowId,
    label,
    options,
    connectionId,
  } = props;
  const handleOpenDrawer = usePushRightDrawer(id);

  const handleSave = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;

      onFieldChange(id, rule);
    }
  };

  return (
    <div className={classes.dynaSalesforceQualifierWrapper}>
      <SalesforceEditorDrawer
        title="Field specific qualification criteria"
        id={id}
        value={value}
        resourceId={resourceId}
        flowId={flowId}
        onSave={handleSave}
        connectionId={connectionId}
        options={options}
        />

      <div className={classes.textField}>
        <div className={classes.salesforceQualifierLabelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
          {/* TODO (Sravan) :Field Help is not rendering */}
        </div>
        <FormControl className={classes.salesforceFormControl}>
          <TextField
            key={id}
            name={name}
            className={classes.textField}
            placeholder={placeholder}
            disabled
            required={required}
            error={!isValid}
            value={value || ''}
            variant="filled"
          />
          <FieldMessage
            isValid={isValid}
            errorMessages={errorMessages}
          />
        </FormControl>
      </div>
      <ActionButton
        disabled={!options?.hasSObjectType}
        data-test={id}
        onClick={handleOpenDrawer}
        className={classes.exitButtonSalesforceQualifier}>
        <FilterIcon />
      </ActionButton>
    </div>
  );
}
