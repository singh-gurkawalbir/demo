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
    // disabled,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const formattedRule = Array.isArray(value) ? value[arrayIndex] : value;

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
    dispatch(actions._editor.init(id, 'handlebars', {
      rule: typeof formattedRule === 'string' ? formattedRule : JSON.stringify(formattedRule, null, 2),
      // interesting. How do we use formKey?
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: 'flowInput',
      // TODO: @ashu Propose to push the save callback into the editor state so that
      // we have a single implementation of save button in all editors...
      // If this callback exists, we call it, otherwise we default to the
      // foreground/background save logic in the processor logic.
      onSave: handleSave,
    }));

    history.push(`${match.url}/editor/${id}`);
  }, [dispatch, id, formattedRule, formKey, flowId, resourceId, resourceType, handleSave, history, match.url]);

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
