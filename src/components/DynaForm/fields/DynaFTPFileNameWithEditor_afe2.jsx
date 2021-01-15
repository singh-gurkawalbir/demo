import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ActionButton from '../../ActionButton';
import AfeIcon from '../../icons/AfeIcon';
import DynaTimestampFileName from './DynaTimestampFileName';
import actions from '../../../actions';
import { getValidRelativePath } from '../../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  dynaActionButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
    background: 'transparent',
  },
  dynaRowWrapper: {
    display: 'flex',
    flexDirection: 'row !important',
  },
}));

export default function _DynaFTPFileNameWithEditor_(props) {
  const {id, flowId, resourceId, resourceType, onFieldChange, formKey} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);
  const handleSave = useCallback(editorValues => {
    onFieldChange(id, editorValues.rule);
  }, [id, onFieldChange]);

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
  }, [dispatch, editorId, formKey, flowId, resourceId, resourceType, id, handleSave, history, match.url]);

  return (
    <>
      <div className={classes.dynaRowWrapper}>
        <DynaTimestampFileName
          {...props}
    />
        <ActionButton
          data-test={id}
          onClick={handleEditorClick}
          className={classes.dynaActionButton}>
          <AfeIcon />
        </ActionButton>
      </div>
    </>
  );
}
