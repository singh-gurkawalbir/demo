import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import AFEButtonGroup from './AFEButtonGroup';
import MappingsButtonGroup from './MappingsButtonGroup';

export default function SaveButtonGroup({ editorId, onClose }) {
  const editorType = useSelector(state => selectors.editor(state, editorId).editorType);

  return (
    editorType === 'mappings' || editorType === 'responseMappings'
      ? (
        <MappingsButtonGroup
          editorId={editorId}
          onClose={onClose} />
      )
      : (
        <AFEButtonGroup
          editorId={editorId}
          onClose={onClose} />
      )
  );
}
