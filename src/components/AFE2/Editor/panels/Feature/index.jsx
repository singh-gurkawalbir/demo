import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';
import PanelLoader from '../../../../PanelLoader';

export default function FeaturePanel({ editorId, mode, featureName, disabled }) {
  const dispatch = useDispatch();
  const initStatus = useSelector(state => selectors._editor(state, editorId).initStatus);
  const featureValue = useSelector(state => selectors._editor(state, editorId)[featureName]);

  // TODO: @Ashu, how should we handle validating and presenting errors here?
  // Should editorViolations be a map where the key is the panel name?
  // or we pass another argument to the _editorViolations selector to
  // identify what subset of the errors we want?
  // const violations = useSelector(state =>
  //   selectors._editorViolations(state, editorId),
  // );

  const handleChange = value => {
    dispatch(actions._editor.patchFeatures(editorId, {[featureName]: value}));
  };

  return (
    <>
      {initStatus === 'requested' ? (
        <PanelLoader />
      ) : (
        <CodePanel
          value={featureValue}
          mode={mode}
          readOnly={disabled}
          onChange={handleChange}
          // errorLine={!!violations?.errorLine}
          // hasError={!!violations?.dataError}
    />
      )}
    </>
  );
}
