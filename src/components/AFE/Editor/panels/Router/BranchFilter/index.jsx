import React from 'react';
import './qbOverrides.css';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../../reducers';
import BranchFilterPanel from '../../../../../BranchFilterPanel';

export default function BranchFilter({ editorId, position }) {
  const rule = useSelector(state => {
    const editorRule = selectors.editorRule(state, editorId);

    return editorRule?.branches?.[position]?.inputFilter?.rules;
  });

  return (
    <BranchFilterPanel editorId={editorId} rule={rule} event="focusout" position={position} />
  );
}
