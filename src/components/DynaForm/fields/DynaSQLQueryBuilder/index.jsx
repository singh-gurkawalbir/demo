import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Button, FormLabel, FormHelperText } from '@material-ui/core';
import FieldHelp from '../../FieldHelp';
import usePushRightDrawer from '../../../../hooks/usePushRightDrawer';
import SQLQueryBuilderWrapper from './SQLQueryBuilderWrapper';
import useFormContext from '../../../Form/FormContext';

const useStyles = makeStyles(theme => ({
  sqlContainer: {
    width: '100%',
  },
  sqlBtn: {
    maxWidth: 100,
  },
  sqlLabel: {
    marginBottom: 6,
  },
  sqlLabelWrapper: {
    display: 'flex',
  },
  errorBtn: {
    borderColor: theme.palette.error.dark,
    color: theme.palette.error.dark,
    '&:hover': {
      borderColor: theme.palette.error.main,
      color: theme.palette.error.main,
    },
  },
}));

export default function DynaSQLQueryBuilder(props) {
  const classes = useStyles();
  const {
    id,
    label,
    required,
    isValid,
    errorMessages,
    lookupFieldId,
    modelMetadataFieldId,
    queryTypeField,
  } = props;
  const handleOpenDrawer = usePushRightDrawer(id);
  const {value: formValue} = useFormContext(props.formKey);
  const lookups = lookupFieldId && formValue[`/${lookupFieldId.replace('.', '/')}`];
  const modelMetadata = modelMetadataFieldId && formValue[`/${modelMetadataFieldId.replace('.', '/')}`];
  const queryType = queryTypeField && formValue[`/${queryTypeField.replace('.', '/')}`];

  return (
    <>
      <div className={classes.sqlContainer}>
        <SQLQueryBuilderWrapper
          {...props}
          lookups={lookups}
          modelMetadata={modelMetadata}
          queryType={queryType}
        />

        <div className={classes.sqlLabelWrapper}>
          <FormLabel className={classes.sqlLabel} required={required}>{label}</FormLabel>
          <FieldHelp {...props} />
        </div>
        <Button
          className={clsx(classes.sqlBtn, { [classes.errorBtn]: !isValid})}
          data-test={id}
          variant="outlined"
          color="secondary"
          onClick={handleOpenDrawer}>
          Launch
        </Button>
        {!isValid && <FormHelperText error>{errorMessages}</FormHelperText>}

      </div>
    </>
  );
}
