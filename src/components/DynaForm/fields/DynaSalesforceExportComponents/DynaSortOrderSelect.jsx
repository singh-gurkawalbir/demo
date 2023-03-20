import React, { useCallback } from 'react';
import { FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import DynaSelectOptionsGenerator from '../DynaRefreshableSelect';
import DynaSelect from '../DynaSelect';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles(theme => ({
  order: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    '& >div': {
      marginRight: theme.spacing(1),
    },
  },
  dynaKeyValueLabelWrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-start',
  },
  label: {
    marginBottom: 6,
  },
}));

const orderOptions = [
  {
    items: [
      { label: 'Ascending order', value: 'Asc' },
      { label: 'Descending order', value: 'Desc' },
    ],
  },
];
export default function DynaSortOrderSelect(props) {
  const {
    id,
    label,
    value,
    onFieldChange,
    isLoggable,
  } = props;
  const fieldValue = value?.split(' ')?.[0];
  const fieldOrder = value?.split(' ')?.[1];
  const classes = useStyles();

  const onOrderChange = useCallback((_, newOrder) => {
    // add the sort order only if any field is selected
    if (fieldValue) {
      onFieldChange(id, `${fieldValue} ${newOrder}`);
    }
  }, [id, fieldValue, onFieldChange]);

  const onFieldChangeFn = useCallback((id, newValue) => {
    // don't add sort order if no field is selected
    if (!newValue) {
      return onFieldChange(id, newValue);
    }

    if (fieldOrder) {
      onFieldChange(id, `${newValue} ${fieldOrder}`);
    } else {
      onFieldChange(id, newValue);
    }
  }, [fieldOrder, onFieldChange]);

  return (
    <>
      <div className={classes.dynaKeyValueLabelWrapper}>
        <FormLabel className={classes.label}>{label}</FormLabel>
        <FieldHelp {...props} />
      </div>
      <div className={classes.order}>
        <DynaSelectOptionsGenerator
          {...props}
          helpKey=""
          label="Field"
          value={fieldValue}
          onFieldChange={onFieldChangeFn} />
        <DynaSelect
          isLoggable={isLoggable}
          label="Order"
          onFieldChange={onOrderChange}
          value={fieldOrder}
          options={orderOptions} />
      </div>
    </>
  );
}
