import { cloneElement } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';

export default function FormContext(props) {
  const { children, ...rest } = props;
  const { formKey } = rest;
  const formState = useSelector(state =>
    selectors.getFormState(state, formKey)
  );

  return cloneElement(children, { ...formState });
}
