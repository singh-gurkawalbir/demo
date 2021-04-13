import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RefreshIcon from '../../../../icons/RefreshIcon';
import IconTextButton from '../../../../IconTextButton';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';

export default function RefreshSampleData({editorId, title}) {
  const isPlaygroundEditor = useSelector(state => selectors._editor(state, editorId).isPlaygroundEditor);
  const dispatch = useDispatch();
  const handleRefreshClick = () => {
    dispatch(actions._editor.sampleDataRequest(editorId));
  };

  return (
    <>
      {title}
      <IconTextButton
        disabled={isPlaygroundEditor}
        data-test="refreshSampleData"
        variant="text"
        color="primary"
        onClick={handleRefreshClick}>
        <RefreshIcon />
      </IconTextButton>
    </>
  );
}
