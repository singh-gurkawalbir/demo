import React, { useCallback } from 'react';
import './qbOverrides.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../../../reducers';
import BranchFilterPanel from '../../../../../BranchFilterPanel';
import actions from '../../../../../../actions';

export default function BranchFilter({ editorId, position }) {
  const rule = useSelector(state => {
    const editorRule = selectors.editorRule(state, editorId);

    return editorRule?.branches?.[position]?.inputFilter?.rules;
  });
  const dispatch = useDispatch();
  const handlePatchEditor = useCallback(
    value => {
      if (!value) {
        dispatch(
          actions.editor.patchRule(editorId, false, {
            actionType: 'setSkipEmptyRuleCleanup',
            position,
          })
        );
      }
      dispatch(
        actions.editor.patchRule(editorId, value, {
          rulePath: `branches[${position}].inputFilter.rules`,
        })
      );
    },
    [dispatch, position, editorId]
  );

  return (
    <BranchFilterPanel
      editorId={editorId}
      rule={rule}
      type="branchFilter"
      position={position}
      handlePatchEditor={handlePatchEditor}
    />
  );
}
