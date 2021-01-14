/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import DynaText from './DynaText';
import { getValidRelativePath } from '../../../utils/routePaths';
import actions from '../../../actions';

/**
 * DynaQuery is being used to Define Query under Database Lookup
 */

export default function DynaQuery_afe2(props) {
  const { id, onFieldChange, formKey, sampleData } = props;
  const editorId = getValidRelativePath(id);
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();

  const handleSave = useCallback(editorValues => {
    const { rule } = editorValues;

    onFieldChange(id, rule);
  }, [id, onFieldChange]);

  const handleEditorClick = useCallback(() => {
    dispatch(actions._editor.init(editorId, 'sql', {
      data: sampleData,
      formKey,
      fieldId: id,
      stage: 'flowInput',
      onSave: handleSave,
    }));

    history.push(`${match.url}/editor/${editorId}`);
  }, [dispatch, editorId, formKey, handleSave, history, id, match.url, sampleData]);

  return (
    <>
      <DynaText {...props} disabled multiline />
      <Button
        data-test={id}
        variant="outlined"
        color="secondary"
        onClick={handleEditorClick}>
        Launch
      </Button>
    </>
  );
}
