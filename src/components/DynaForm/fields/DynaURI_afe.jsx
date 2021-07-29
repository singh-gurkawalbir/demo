/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ActionButton from '../../ActionButton';
import AfeIcon from '../../icons/AfeIcon';
import DynaTextWithFlowSuggestion from './DynaTextWithFlowSuggestion';
import actions from '../../../actions';
import { getValidRelativePath } from '../../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  dynaURIActionButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
    background: 'transparent',
  },
  dynaURIWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
}));

export default function DynaURI_afe(props) {
  const {
    id,
    onFieldChange,
    value = '',
    resourceId,
    resourceType,
    flowId,
    description,
    formKey,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);

  const handleSave = useCallback(editorValues => {
    onFieldChange(id, editorValues.rule);
  }, [id, onFieldChange]);

  const handleEditorClick = useCallback(() => {
    dispatch(actions.editor.init(editorId, 'handlebars', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: 'flowInput',
      onSave: handleSave,
      url: match.url,
    }));

    history.push(`${match.url}/editor/${editorId}`);
  }, [dispatch, id, formKey, flowId, resourceId, resourceType, handleSave, history, match.url, editorId]);

  return (
    <>
      <div className={classes.dynaURIWrapper}>
        <DynaTextWithFlowSuggestion
          description={description}
          id={id}
          value={value}
          {...props}
        />
        <ActionButton
          data-test={id}
          tooltip="Open handlebars editor"
          onClick={handleEditorClick}
          className={classes.dynaURIActionButton}>
          <AfeIcon />
        </ActionButton>
      </div>
    </>
  );
}
