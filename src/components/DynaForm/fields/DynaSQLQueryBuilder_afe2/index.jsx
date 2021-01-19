/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import actions from '../../../../actions';
import { getValidRelativePath } from '../../../../utils/routePaths';
import DynaHandlebarPreview from '../DynaHandlebarPreview';

export default function DynaSQLQueryBuilder_afe2(props) {
  const {
    id,
    resourceId,
    resourceType,
    flowId,
    formKey,
    onFieldChange,
    arrayIndex,
    value,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);

  const handleSave = useCallback(editorValues => {
    const { rule, defaultData, supportsDefaultData } = editorValues;

    if (supportsDefaultData) {
      let parsedDefaultData;

      try {
        parsedDefaultData = JSON.parse(defaultData);

        if (parsedDefaultData.data) {
          onFieldChange('modelMetadata', parsedDefaultData.data);
        } else if (parsedDefaultData.record) {
          onFieldChange('modelMetadata', parsedDefaultData.record);
        } else if (parsedDefaultData.row) {
          onFieldChange('modelMetadata', parsedDefaultData.row);
        }
      } catch (e) { // do nothing }
      }
    }
    if (typeof arrayIndex !== 'undefined' && Array.isArray(value)) {
      // save to array at position arrayIndex
      const valueTmp = value;

      valueTmp[arrayIndex] = rule;
      onFieldChange(id, valueTmp);
    } else {
      // save to field
      onFieldChange(id, rule);
    }
  }, [arrayIndex, id, onFieldChange, value]);

  const handleEditorClick = useCallback(() => {
    dispatch(actions._editor.init(editorId, 'sql', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: 'flowInput',
      onSave: handleSave,
    }));

    history.push(`${match.url}/editor/${editorId}`);
  }, [dispatch, editorId, formKey, flowId, resourceId, resourceType, id, handleSave, history, match.url]);

  return (
    <DynaHandlebarPreview {...props} onEditorClick={handleEditorClick} />
  );
}
