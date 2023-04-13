import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';

export default function FeaturePanel({ editorId, mode, featureName }) {
  const dispatch = useDispatch();
  const sampleDataStatus = useSelector(state => selectors.editor(state, editorId).sampleDataStatus);
  const featureValue = useSelector(state => selectors.editor(state, editorId)[featureName]);
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));

  const handleChange = value => {
    dispatch(actions.editor.patchFeatures(editorId, {[featureName]: value}));
  };

  return (
    <>
      {sampleDataStatus === 'requested' ? (
        <Spinner center="screen" />
      ) : (
        <CodePanel
          name="feature"
          value={featureValue}
          mode={mode}
          readOnly={disabled}
          onChange={handleChange}
    />
      )}
    </>
  );
}
