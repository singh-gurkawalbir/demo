/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import { FormLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { Fragment, useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import FieldHelp from '../FieldHelp';
import ErroredMessageComponent from './ErroredMessageComponent';
import actions from '../../../actions';
import { getValidRelativePath } from '../../../utils/routePaths';

const useStyles = makeStyles({
  dynaHttpRequestBodyWrapper: {
    width: '100%',
  },
  dynaHttpRequestlabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaReqBodyBtn: {
    maxWidth: 100,
  },
  dynaHttpReqLabel: {
    marginBottom: 6,
  },
});

export default function DynaHttpRequestBody_afe2(props) {
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
    // disabled,
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
      const valueTmp = value;

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
          <FormLabel className={classes.dynaHttpReqLabel}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaReqBodyBtn}
          onClick={handleEditorClick}>
          Launch
        </Button>
      </div>
      <ErroredMessageComponent {...props} />
    </Fragment>
  );
}
