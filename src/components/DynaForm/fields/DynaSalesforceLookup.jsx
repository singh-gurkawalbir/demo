import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormControl, FormLabel } from '@material-ui/core';
import * as selectors from '../../../reducers';
import SalesforceLookupFilterEditorDialog from '../../AFE/SalesforceLookupFilterEditor';
import actions from '../../../actions';
import getJSONPaths, { pickFirstObject } from '../../../utils/jsonPaths';
import ActionButton from '../../ActionButton';
import FilterIcon from '../../icons/FilterIcon';
import FieldHelp from '../FieldHelp';
import ErroredMessageComponent from './ErroredMessageComponent';

const useStyles = makeStyles(theme => ({
  lookupFieldWrapper: {
    display: 'flex',
  },
  lookupField: {
    width: '100%',
  },
  exitButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
}));

export default function DynaSalesforceLookup(props) {
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
    multiline,
    options,
  } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const dispatch = useDispatch();
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;

      onFieldChange(id, rule);
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
    const extractPaths = getJSONPaths(
      pickFirstObject(extractFields, null, {
        wrapSpecialChars: true,
      })
    );

    formattedExtractFields =
      (extractPaths &&
        extractPaths.map(obj => ({
          name: obj.id,
          id: obj.id.replace('[*].', '(*).'),
        }))) ||
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

  return (
    <>
      {showEditor && (
        <SalesforceLookupFilterEditorDialog
          title="Define lookup criteria"
          id={id}
          data={formattedExtractFields}
          value={value}
          onClose={handleClose}
          // disabled={disabled}
          options={options}
        />
      )}

      <FormControl className={classes.dynaTextFormControl}>
        <div className={classes.dynaTextLabelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        <div className={classes.lookupFieldWrapper}>
          <div className={classes.lookupField}>
            <TextField
              key={id}
              name={name}
              multiline={multiline}
              placeholder={placeholder}
              className={classes.lookupField}
              disabled
              value={value}
              variant="filled"
            />

            <ErroredMessageComponent
              isValid={isValid}
              errorMessages={errorMessages}
            />
          </div>
          <ActionButton
            data-test={id}
            onClick={handleEditorClick}
            className={classes.exitButton}>
            <FilterIcon />
          </ActionButton>
        </div>
      </FormControl>
    </>
  );
}
