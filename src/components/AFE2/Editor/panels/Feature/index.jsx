import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';
import Spinner from '../../../../Spinner';

export default function FeaturePanel({ editorId, mode, featureName }) {
  const dispatch = useDispatch();
  const sampleDataStatus = useSelector(state => selectors._editor(state, editorId).sampleDataStatus);
  const featureValue = useSelector(state => selectors._editor(state, editorId)[featureName]);
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));

  const handleChange = value => {
    dispatch(actions._editor.patchFeatures(editorId, {[featureName]: value}));
  };

  return (
    <>
      {sampleDataStatus === 'requested' ? (
        <Spinner centerAll />
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
