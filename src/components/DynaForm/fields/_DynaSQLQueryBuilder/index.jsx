import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Button, FormLabel, FormHelperText } from '@material-ui/core';
import FieldHelp from '../../FieldHelp';
import actions from '../../../../actions';
import { getValidRelativePath } from '../../../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  sqlContainer: {
    width: '100%',
  },
  sqlBtn: {
    maxWidth: 100,
  },
  sqlLabel: {
    marginBottom: 6,
  },
  sqlLabelWrapper: {
    display: 'flex',
  },
  errorBtn: {
    borderColor: theme.palette.error.dark,
    color: theme.palette.error.dark,
    '&:hover': {
      borderColor: theme.palette.error.main,
      color: theme.palette.error.main,
    },
  },
}));

export default function _DynaSQLQueryBuilder_(props) {
  const {
    id,
    label,
    required,
    isValid,
    errorMessages,
    resourceId,
    resourceType,
    flowId,
    formKey,
    onFieldChange,
    arrayIndex,
    value,
  } = props;
  const classes = useStyles();
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
  }, [dispatch, id, formKey, flowId, resourceId, resourceType, handleSave, history, match.url, editorId]);

  return (
    <>
      <div className={classes.sqlContainer}>
        <div className={classes.sqlLabelWrapper}>
          <FormLabel className={classes.sqlLabel} required={required}>{label}</FormLabel>
          <FieldHelp {...props} />
        </div>
        <Button
          className={clsx(classes.sqlBtn, { [classes.errorBtn]: !isValid})}
          data-test={id}
          variant="outlined"
          color="secondary"
          onClick={handleEditorClick}>
          Launch
        </Button>
        {!isValid && <FormHelperText error>{errorMessages}</FormHelperText>}
      </div>
    </>
  );
}
