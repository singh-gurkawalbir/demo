/* eslint-disable camelcase */
import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import DynaURI from './DynaURI_afe';

export default function DynaRelativeUri_afe({ value, arrayIndex, ...props }) {
  const connection = useSelector(state => selectors.resource(state, 'connections', props.connectionId));
  const { type } = connection || {};
  const description = type === 'http' || type === 'rest' ? `Relative to: ${connection[type].baseURI}` : '';
  const inputValue = typeof arrayIndex === 'number' && Array.isArray(value) ? value[arrayIndex] : value;

  return (
    <DynaURI
      {...props}
      value={inputValue}
      description={description}
    />
  );
}
