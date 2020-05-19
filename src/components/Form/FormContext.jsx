import { useSelector, shallowEqual } from 'react-redux';
import * as selectors from '../../reducers';

export default function useFormContext(formKey) {
  const formState = useSelector(
    state => selectors.formState(state, formKey),
    shallowEqual
  );

  return formState;
}
