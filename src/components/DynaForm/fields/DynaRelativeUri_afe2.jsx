import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import _DynaURI_ from './DynaURI_afe2';

export default function _DynaRelativeUri_({ value, arrayIndex, ...props }) {
  const connection = useSelector(state => selectors.resource(state, 'connections', props.connectionId));
  const { type } = connection || {};
  const description = type === 'http' || type === 'rest' ? `Relative to: ${connection[type].baseURI}` : '';
  const inputValue = typeof arrayIndex === 'number' && Array.isArray(value) ? value[arrayIndex] : value;

  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <_DynaURI_
      {...props}
      value={inputValue}
      description={description}
    />
  );
}
