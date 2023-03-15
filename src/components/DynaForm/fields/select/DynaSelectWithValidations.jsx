import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../reducers';
import DynaSelect from '../DynaSelect';
import FieldHelp from '../../FieldHelp';
import FieldMessage from '../FieldMessage';

const useStyles = makeStyles({
  dynaTextLabelWrapper: {
    display: 'flex',
  },
});
const emptyObj = {};
const emptyArr = [];

export default function DynaSelectWithValidations(props) {
  const {formKey, value, options = emptyArr} = props;
  const classes = useStyles();
  const [description, setDescription] = useState('');
  const formFields = useSelector(state => selectors.formState(state, formKey)?.fields || emptyObj);

  const {fieldsToValidate, regex, description: itemDescription, helpKey} = useMemo(() => options[0]?.items?.find(item => item.value === value) || emptyObj, [options, value]);

  useEffect(() => {
    setDescription(itemDescription);

    // if either of the fields contain the regex, remove the description
    const validated = fieldsToValidate?.some(field => regex.test(formFields[field]?.value));

    if (validated) {
      setDescription('');
    }
  }, [fieldsToValidate, formFields, regex, itemDescription]);

  return (
    <>
      <DynaSelect
        {...props} />
      <div className={classes.dynaTextLabelWrapper}>
        <FieldMessage
          isValid
          description={description} />
        {description && <FieldHelp helpKey={helpKey} />}
      </div>
    </>
  );
}

