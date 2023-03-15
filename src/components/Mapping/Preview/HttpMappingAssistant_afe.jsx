/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import CodePanel from '../../AFE/Editor/panels/Code';

const useStyles = makeStyles(theme => ({
  header: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  editor: {
    width: '100%',
    height: '100%',
    '& > div': {
      background: theme.palette.background.paper2,
    },
  },
}));

export default function HttpMappingAssistant_afe({ importId }) {
  const editorId = 'httpPreview';
  const dispatch = useDispatch();
  const classes = useStyles();
  const { data: editorData, result, autoEvaluate } = useSelector(state => selectors.editor(state, editorId), shallowEqual);
  const dataInput = useSelector(state => selectors.mappingHttpAssistantPreviewData(state, importId)?.data);
  const rule = useSelector(state => selectors.mappingHttpAssistantPreviewData(state, importId)?.rule);

  useEffect(() => {
    // this component requires editor only to view the evaluated result of the handlebars processor
    dispatch(actions.editor.init(editorId, 'handlebars', {
      resourceId: importId,
      resourceType: 'imports',
      rule,
      data: dataInput,
    }));

    return () => dispatch(actions.editor.clear(editorId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // since handlebars editors use autoEvaluate as false everywhere
    // this is the only exception so dispatching the action to flip this flag
    if (autoEvaluate === false) {
      dispatch(actions.editor.toggleAutoPreview(editorId));
    }
    if (editorData && dataInput && editorData !== dataInput) {
      dispatch(actions.editor.patchData(editorId, dataInput));
    }
  }, [autoEvaluate, dataInput, dispatch, editorData]);

  return (
    <>
      <div className={classes.header}>
        <Typography variant="h4">Preview</Typography>
      </div>
      <div className={classes.editor}>
        <CodePanel
          height="100%"
          width="100%"
          name="result"
          value={result?.data || ''}
          mode="text"
          readOnly
        />
      </div>
    </>
  );
}
