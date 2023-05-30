import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextToggle } from '@celigo/fuse-ui';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import Help from '../../../Help';

const toggleMapperOptions = [
  { label: 'Mapper 1.0', value: 1 },
  { label: 'Mapper 2.0', value: 2 },
];

export default function ToggleMapperVersion({ editorId }) {
  const dispatch = useDispatch();
  const showToggle = useSelector(state => {
    const isMapper2Supported = selectors.isMapper2Supported(state);
    const {resourceId} = selectors.editor(state, editorId);
    const resource = selectors.resource(state, 'imports', resourceId);

    // for IAs we should not show toggle switch
    if (resource?._connectorId) return false;

    return isMapper2Supported;
  });
  const mappingVersion = useSelector(state => selectors.mappingVersion(state));
  const saveInProgress = useSelector(state => selectors.isEditorSaveInProgress(state, editorId));

  const handleVersionToggle = useCallback((event, newVersion) => {
    dispatch(actions.mapping.toggleVersion(newVersion));
  }, [dispatch]);

  if (!showToggle) return null;

  return (
    <>
      <TextToggle
        disabled={saveInProgress}
        value={mappingVersion}
        onChange={handleVersionToggle}
        options={toggleMapperOptions}
        sx={{
          minWidth: '88px !important',
        }}
      />
      <Help
        title="Mapper"
        helpKey="afe.mappings.toggle"
      />
    </>
  );
}
