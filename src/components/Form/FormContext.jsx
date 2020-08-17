import { useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../reducers';

const emptyObj = {};
export default function useFormContext(formKey) {
  const formState = useSelector(
    state => selectors.formState(state, formKey) || emptyObj,
    shallowEqual
  );

  return formState;
}
