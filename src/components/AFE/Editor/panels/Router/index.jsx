import React from 'react';
// import { useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
// import actions from '../../../../../actions';
// import { selectors } from '../../../../../reducers';
// import CodePanel from '../Code';

export default function RouterPanel({ editorId }) {
  // const dispatch = useDispatch();
  //  const rule = useSelector(state => selectors.editorRule(state, editorId));
  //  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  //  const { errorLine, error} = useSelector(state => selectors.editorPreviewError(state, editorId));
  // const handleChange = newRule => {
  //   dispatch(actions.editor.patchRule(editorId, newRule));
  // };

  return (
    <Typography variant="h3">Branching config for editor {editorId}!</Typography>
  );
}
