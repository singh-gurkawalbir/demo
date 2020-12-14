import React from 'react';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';
import PanelLoader from '../../../../PanelLoader';

export default function FeaturePanel({ editorId, mode, featureName }) {
  const dispatch = useDispatch();
  const {initStatus, disabled, featureValue} = useSelector(state => {
    const e = selectors._editor(state, editorId);

    return {
      initStatus: e.initStatus,
      disabled: e.disabled,
      featureValue: e[featureName],
    };
  }, shallowEqual);

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
