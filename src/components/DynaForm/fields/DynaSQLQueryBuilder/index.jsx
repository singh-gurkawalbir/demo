import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Button, FormLabel, FormHelperText } from '@material-ui/core';
import FieldHelp from '../../FieldHelp';
import { selectors } from '../../../../reducers';
import usePushRightDrawer from '../../../../hooks/usePushRightDrawer';
import SQLQueryBuilderWrapper from './SQLQueryBuilderWrapper';
import useFormContext from '../../../Form/FormContext';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

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
    resourceId,
  } = props;
  const handleOpenDrawer = usePushRightDrawer(id);
  const {value: formValue} = useFormContext(props.formKey);
  const { merged: resourceData } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'imports',
    resourceId
  );
  const { adaptorType} = resourceData;
  const options = useMemo(() => {
    if (adaptorType === 'RDBMSImport') {
      return {
        lookups: formValue['/rdbms/lookups'],
        modelMetadata: formValue['/modelMetadata'],
        queryType: formValue['/rdbms/queryType'],
      };
    }
    if (adaptorType === 'MongodbImport') {
      return {
        method: formValue['/mongodb/method'],
      };
    }
    if (adaptorType === 'DynamodbImport') {
      return {
        method: formValue['/dynamodb/method'],
      };
    }
  }, [adaptorType, formValue]);

  return (
    <>
      <div className={classes.sqlContainer}>
        <SQLQueryBuilderWrapper
          {...props}
          {...options}
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
