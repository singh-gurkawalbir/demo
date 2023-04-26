import React, { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import FormLabel from '@mui/material/FormLabel';
import { useDispatch } from 'react-redux';
import CodeEditor from '../../../CodeEditor';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';
import ExpandWindowIcon from '../../../icons/ExpandWindowIcon';
import FieldMessage from '../FieldMessage';
import FieldHelp from '../../FieldHelp';
import ExpandEditorModal from './ExpandModeEditor/Modal';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import { isJsonString } from '../../../../utils/string';
import actions from '../../../../actions';
import { isJsonValue } from '../../../../utils/json';

const useStyles = makeStyles(theme => ({
  label: {
    fontSize: '12px',
    marginTop: theme.spacing(1),
  },
  dynaEditorButton: {
    float: 'right',
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  inlineEditorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: theme.spacing(10),
  },
  wrapper: {
    flexDirection: 'row !important',
    alignItems: 'flex-start',
    display: 'flex',
  },
  dynaEditorWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  codeEditorWrapper: {
    width: '100%',
  },
  dynaEditorTextLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
}));

const useValidateContent = ({
  id,
  label,
  mode,
  formKey,
  validateContent,
  value,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!validateContent) return;

    let errorMessages;

    if (typeof validateContent === 'function') {
      errorMessages = validateContent(value);
    } else if (mode === 'json') {
      errorMessages = isJsonValue(value, label);
    } else { // no action to be performed
      return;
    }

    if (errorMessages) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages}));
    } else {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
};

export default function DynaEditor(props) {
  const {
    id,
    mode,
    expandMode = 'modal',
    options,
    onFieldChange,
    value,
    className,
    label,
    editorClassName,
    disabled,
    saveMode,
    description,
    errorMessages,
    required,
    isValid,
    skipJsonParse,
    customHandleUpdate,
    customHandleEditorClick,
    isLoggable,
    validateContent,
    modalTitle,
    formKey,
  } = props;
  const history = useHistory();
  const match = useRouteMatch();
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();

  useValidateContent({id, formKey, label, mode, validateContent, value});

  const handleEditorClick = useCallback(() => {
    if (customHandleEditorClick) {
      customHandleEditorClick();

      return;
    }
    if (expandMode === 'drawer') {
      const { formKey, id } = props;

      history.push(`${buildDrawerUrl({
        path: drawerPaths.DYNA_EDITOR_EXPAND,
        baseUrl: match.url,
        params: { formKey, fieldId: id },
      })}`);
    } else {
      setShowEditor(!showEditor);
    }
  }, [customHandleEditorClick, expandMode, props, history, match.url, showEditor]);
  const handleUpdate = useCallback(
    editorVal => {
      if (customHandleUpdate) {
        customHandleUpdate(editorVal);

        return;
      }
      let sanitizedVal = editorVal;

      // convert to json if form value is an object
      // TODO: doing JSON.parse everytime user enters a key stroke, causes whitespaces
      // to be removed which moves the cursor position
      // confirm if this functionality is used anywhere, else remove this logic
      if (
        saveMode === 'json' ||
        (mode === 'json' && typeof value === 'object' && !skipJsonParse)
      ) {
        // user trying to remove the json. Handle removing the value during presave
        if (editorVal === '') {
          onFieldChange(id, '', false);

          return;
        }

        if (isJsonString(editorVal)) {
          sanitizedVal = JSON.parse(editorVal);
        }
      }

      onFieldChange(id, sanitizedVal, false);
    },
    [customHandleUpdate, saveMode, mode, value, skipJsonParse, onFieldChange, id]
  );
  // Options handler would return the selected file type we would use that
  // and inject it as the mode of the editor so that syntax formating would work
  // according to the file format
  const getFileType = () => {
    if (options && options.file) return options.file;

    return mode;
  };

  const modeFromFileOption = getFileType();
  let resultantMode = mode;

  // In the event the user selected a different file type
  // we would use that
  // The default values for both the fields would be the same
  if (modeFromFileOption !== mode) {
    resultantMode = modeFromFileOption;
  }

  return (
    <div className={clsx(classes.wrapper, className)}>
      <div className={classes.dynaEditorWrapper}>
        {
          showEditor && (
            <ExpandEditorModal
              show={showEditor}
              handleClose={handleEditorClick}
              label={modalTitle || label}
              validateContent={validateContent}
              editorProps={{
                id,
                value,
                mode: resultantMode,
                disabled,
                handleUpdate,
              }}
          />
          )
        }
        <div className={classes.dynaEditorTextLabelWrapper}>
          <FormLabel required={required} error={!isValid} >{label}</FormLabel>
          <FieldHelp {...props} />
        </div>

        <div className={clsx(classes.inlineEditorContainer, editorClassName)} {...isLoggableAttr(isLoggable)}>
          <CodeEditor
            readOnly={disabled}
            name={`${id}-inline`}
            value={value}
            mode={mode}
            className={classes.codeEditorWrapper}
            onChange={handleUpdate}
          />
        </div>
        <FieldMessage
          description={description}
          errorMessages={errorMessages}
          isValid={isValid}
        />
      </div>
      <IconButtonWithTooltip
        data-test={id}
        onClick={handleEditorClick}
        tooltipProps={{title: 'Expand Window', placement: 'bottom'}}
        className={classes.dynaEditorButton}>
        <ExpandWindowIcon />
      </IconButtonWithTooltip>
    </div>
  );
}
