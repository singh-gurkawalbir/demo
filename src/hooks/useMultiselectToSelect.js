import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import useFormContext from '../components/Form/FormContext';
import actions from '../actions';

// this hook is used to make 'multiselect' field act as a 'select' field temporarily
// if some value is selected by the user.
export default function useMultiselectToSelect(props) {
  const dispatch = useDispatch();
  const { formKey, selectValue, fieldId } = props;
  const form = useFormContext(formKey);

  useEffect(() => {
    const fieldValues = form?.value?.[fieldId];

    // if selectValue is selected, then unselect all other values
    if (fieldValues?.length > 1 && fieldValues?.includes(selectValue)) {
      dispatch(actions.form.fieldChange(formKey)(fieldId, [selectValue], true));
    }
  }, [dispatch, fieldId, form, formKey, selectValue]);
}
