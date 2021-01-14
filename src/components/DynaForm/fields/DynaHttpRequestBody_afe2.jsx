/* eslint-disable react/jsx-pascal-case */
import React, { Fragment, useCallback } from 'react';
import { makeStyles, FormLabel } from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import FieldHelp from '../FieldHelp';
import ErroredMessageComponent from './ErroredMessageComponent';
import actions from '../../../actions';
import { getValidRelativePath } from '../../../utils/routePaths';
import ActionButton from '../../ActionButton';
import EditIcon from '../../icons/ScriptsIcon';

const useStyles = makeStyles(theme => ({
  dynaHttpRequestBodyWrapper: {
    width: '100%',
  },
  dynaHttpRequestlabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  previewContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  },
  preview: {
    flexGrow: 1,
    maxHeight: 100,
    overflow: 'auto',
    border: `1px solid ${theme.palette.secondary.lightest}`,
    backgroundColor: theme.palette.background.paper2,
    padding: theme.spacing(0, 1),

  },
}));

export default function _DynaHttpRequestBody_(props) {
  const {
    id,
    onFieldChange,
    value,
    label,
    resourceId,
    resourceType,
    flowId,
    arrayIndex,
    formKey,
  } = props;
  const classes = useStyles();
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
    <Fragment key={`${resourceId}-${id}`}>
      <div className={classes.dynaHttpRequestBodyWrapper}>
        <div className={classes.dynaHttpRequestlabelWrapper}>
          <FormLabel>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        <div className={classes.previewContainer}>
          <div className={classes.preview}>
            <pre>{value}</pre>
          </div>
          <ActionButton
            data-test={id}
            variant="outlined"
            color="secondary"
            onClick={handleEditorClick}>
            <EditIcon />
          </ActionButton>
        </div>
      </div>
      <ErroredMessageComponent {...props} />
    </Fragment>
  );
}
