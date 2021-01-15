/* eslint-disable react/jsx-pascal-case */
import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';
import { getValidRelativePath } from '../../../utils/routePaths';
import TemplatePreview from './TemplatePreview';

export default function _DynaHttpRequestBody_(props) {
  const {
    id,
    onFieldChange,
    value,
    resourceId,
    resourceType,
    flowId,
    arrayIndex,
    formKey,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);

  const handleSave = useCallback(editorValues => {
    const { rule } = editorValues;

    // TODO: Give better name for arrayIndex
    if (typeof arrayIndex === 'number' && Array.isArray(value)) {
      // save to array at position arrayIndex
      const valueTmp = [...value];

      valueTmp[arrayIndex] = rule;
      onFieldChange(id, valueTmp);
    } else {
      // save to field
      onFieldChange(id, rule);
    }
  }, [arrayIndex, id, onFieldChange, value]);

  const handleEditorClick = useCallback(() => {
    dispatch(actions._editor.init(editorId, 'handlebars', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: 'flowInput',
      onSave: handleSave,
    }));

    history.push(`${match.url}/editor/${editorId}`);
  }, [dispatch, id, formKey, flowId, resourceId, resourceType, handleSave, history, match.url, editorId]);

  return (
    <TemplatePreview {...props} onEditorClick={handleEditorClick} />
  );
}
