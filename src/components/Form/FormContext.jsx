import { useSelector, shallowEqual } from 'react-redux';
import * as selectors from '../../reducers';

export default function useFormContext(props) {
  const { formKey } = props;
  const formState = useSelector(
    state => selectors.getFormState(state, formKey),
    shallowEqual
  );

  return formState;
}
