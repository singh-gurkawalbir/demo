import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormControl, FormLabel } from '@material-ui/core';
import * as selectors from '../../../reducers';
import NetSuiteLookupFilterEditorDialog from '../../AFE/NetSuiteLookupFilterEditor';
import actions from '../../../actions';
import getJSONPaths, { pickFirstObject } from '../../../utils/jsonPaths';
import ActionButton from '../../ActionButton';
import FilterIcon from '../../icons/FilterIcon';
import FieldHelp from '../FieldHelp';
import ErroredMessageComponent from './ErroredMessageComponent';

const useStyles = makeStyles(theme => ({
  dynaNetsuiteLookupFormControl: {
    width: '100%',
  },
  dynaNetsuiteLookupLabelWrapper: {
    width: '100%',
  },
  dynaNetsuiteFieldLookupWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaNetsuiteLookupField: {
    width: '100%',
  },
  dynaNetsuiteLookupActionBtn: {
    marginTop: theme.spacing(1),
  },
}));

export default function DynaNetSuiteLookup(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const {
    // disabled,
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder,
    required,
    value,
    resourceId,
    flowId,
    label,
    options,
  } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const dispatch = useDispatch();
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;

      onFieldChange(id, JSON.stringify(rule));
    }

    handleEditorClick();
  };

  const extractFields = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType: 'imports',
      stage: 'importMappingExtract',
    })
  );
  let formattedExtractFields = [];

  if (extractFields) {
    const extractPaths = getJSONPaths(pickFirstObject(extractFields));

    formattedExtractFields =
      (extractPaths &&
        extractPaths.map(obj => ({ name: obj.id, id: obj.id }))) ||
      [];
  }

  useEffect(() => {
    if (flowId && !extractFields) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          'imports',
          'importMappingExtract'
        )
      );
    }
  }, [dispatch, extractFields, flowId, resourceId]);

  let rule = [];

  if (value) {
    try {
      rule = JSON.parse(value);
    } catch (e) {
      // do nothing
    }
  }

  return (
    <>
      {showEditor && (
        <NetSuiteLookupFilterEditorDialog
          title="Lookup criteria"
          id={id}
          data={formattedExtractFields}
          value={rule}
          onClose={handleClose}
          // disabled={disabled}
          options={options}
        />
      )}

      <FormControl className={classes.dynaNetsuiteLookupFormControl}>
        <div className={classes.dynaNetsuiteLookupLabelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>

        <div className={classes.dynaNetsuiteFieldLookupWrapper}>
          <div className={classes.dynaNetsuiteLookupField}>
            <TextField
              key={id}
              name={name}
              className={classes.dynaNetsuiteLookupField}
              placeholder={placeholder}
              disabled
              value={value}
              variant="filled"
            />
            <ErroredMessageComponent
              isValid={isValid}
              description=""
              errorMessages={errorMessages}
            />
          </div>
          <ActionButton
            data-test={id}
            onClick={handleEditorClick}
            className={classes.dynaNetsuiteLookupActionBtn}>
            <FilterIcon />
          </ActionButton>
        </div>
      </FormControl>
    </>
  );
}
