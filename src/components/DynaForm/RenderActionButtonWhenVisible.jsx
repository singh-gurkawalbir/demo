import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';

export default function RenderActionButtonWhenVisible({ children, id, formKey }) {
  const isButtonVisible = useSelector(state =>
    selectors.isActionButtonVisibleFromMeta(state, formKey, id)
  );

  if (!isButtonVisible) return null;

  return (
    <>
      {children}
    </>
  );
}
