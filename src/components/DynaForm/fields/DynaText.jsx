import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FormControl, InputAdornment, FormLabel, makeStyles } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import { isNaN } from 'lodash';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import CopyIcon from '../../icons/CopyIcon';
import FieldHelp from '../FieldHelp';
import FieldMessage from './FieldMessage';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import isLoggableAttr from '../../../utils/isLoggableAttr';
import IconButtonWithTooltip from '../../IconButtonWithTooltip';
import HelpLink from '../../HelpLink';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';
import { emptyObject } from '../../../constants';
import { applicationsList } from '../../../constants/applications';

const useStyles = makeStyles(theme => ({
  dynaFieldWrapper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  dynaTextFormControl: {
    width: '100%',
  },
  formField: {
    width: '100%',
  },
  subSection: {
    maxWidth: '95%',
    marginLeft: '5%',
  },
  dynaFieldCopyClipboard: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  copyButton: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
  textFieldWithClipBoard: {
    width: '100%',
  },
  dynaTextLabelWrapper: {
    display: props => (props.label ? 'flex' : 'none'),
    alignItems: 'flex-start',
    '&:empty': {
      display: 'none',
    },
  },
  startAdornmentWrapper: {
    marginTop: '0px !important',
  },
  textAreaField: {
    '& > .MuiFilledInput-multiline': {
      paddingRight: theme.spacing(4),
    },
  },
}));

function DynaText(props) {
  const {
    description,
    disabled,
    errorMessages,
    id,
    autoFocus = false,
    isValid = true,
    name,
    onFieldChange,
    placeholder,
    required,
    value = '',
    label,
    multiline,
    delimiter,
    rowsMax,
    maxLength,
    startAdornment,
    endAdornment,
    readOnly,
    inputType,
    options,
    className,
    disableText = false,
    uppercase = false,
    isLoggable,
    isApplicationPlaceholder = false,
    isLabelUpdate = false,
    isVanConnector = false,
  } = props;
  const [valueChanged, setValueChanged] = useState(false);

  useEffect(() => {
    setValueChanged(true);
  }, [options]);
  useEffect(() => {
    if (valueChanged && options && typeof options === 'string') {
      onFieldChange(id, options, true);
      setValueChanged(false);
    }
  }, [id, onFieldChange, options, valueChanged]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const match = isApplicationPlaceholder || isVanConnector ? useRouteMatch() : {};
  const { id: resourceId, resourceType } = match.params || {};
  let dataResourceType;
  const { merged } =
  useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  ) || {};

  const staggedResource = merged || emptyObject;
  const connection = useSelector(
    state =>
      selectors.resource(state, 'connections', staggedResource?._connectionId) ||
      emptyObject
  );
  const applications = applicationsList().filter(app => app?._httpConnectorId);
  const app = applications.find(a => a._httpConnectorId === (connection?.http?._httpConnectorId || connection?._httpConnectorId)) || {};

  if (resourceType === 'connections') {
    dataResourceType = 'connection';
  } else {
    dataResourceType = (merged?.isLookup === true) ? 'lookup' : resourceType?.slice(0, 6);
  }

  const applicationPlaceholder = isApplicationPlaceholder ? `${(merged.application || app.name)} ${dataResourceType}` : '';

  const updatedLabel = `Name your ${dataResourceType}`;
  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  )?.merged || emptyObject;

  const licenseActionDetails = useSelector(state =>
    selectors.platformLicenseWithMetadata(state)
  );
  const isVanLicenseAbsent = (isVanConnector && licenseActionDetails.van === false);

  const handleFieldChange = event => {
    const { value, valueAsNumber } = event.target;
    let returnVal;

    if (inputType === 'number') {
      returnVal = isNaN(valueAsNumber) ? null : valueAsNumber;

      // resets the value to 0, if user tries to enter negative value
      if (returnVal < 0) returnVal = 0;
    } else {
      returnVal = value;
    }

    if (uppercase) {
      returnVal = returnVal.toUpperCase();
    }

    if (!delimiter) {
      onFieldChange(id, returnVal);

      return;
    }

    onFieldChange(id, value ? value.split(delimiter) : value);
  };

  const classes = useStyles(props);
  const inpValue = value === '' && inputType === 'number' ? 0 : value;
  const InputProps = useMemo(() => {
    const props = {
      startAdornment: startAdornment ? (
        <InputAdornment
          position="start"
          className={classes.startAdornmentWrapper}>
          {startAdornment}
        </InputAdornment>
      ) : null,
      endAdornment: endAdornment ? (
        <InputAdornment position="end">{endAdornment}</InputAdornment>
      ) : null,
      readOnly: !!readOnly,
    };

    if (inputType === 'number') {
      props.inputProps = {
        min: '0',
        step: '1',
      };
    }
    if (maxLength) {
      props.inputProps = { maxLength };
    }

    return props;
  }, [
    classes.startAdornmentWrapper,
    endAdornment,
    inputType,
    readOnly,
    startAdornment,
    maxLength,
  ]);

  return (
    <FormControl className={classes.dynaTextFormControl}>
      <div className={classes.dynaTextLabelWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {(merged?.http?._httpConnectorId || merged?.isHttpConnector || merged?._httpConnectorId || merged?.http?._httpConnectorResourceId) && isLabelUpdate ? updatedLabel : label}
        </FormLabel>
        <FieldHelp {...props} />
        <HelpLink helpLink={props.helpLink} />
      </div>
      <TextField
        {...isLoggableAttr(isLoggable)}
        autoComplete="off"
        key={id}
        data-test={id}
        autoFocus={autoFocus}
        name={name}
        InputProps={InputProps}
        type={inputType}
        placeholder={isApplicationPlaceholder && (merged?.http?._httpConnectorId || merged?.isHttpConnector || merged?._httpConnectorId || merged?.http?._httpConnectorResourceId) ? applicationPlaceholder : placeholder}
        disabled={resource.type === 'van' ? isVanLicenseAbsent : disabled || disableText}
        multiline={multiline}
        rowsMax={rowsMax}
        required={required}
        value={inpValue}
        variant="filled"
        onChange={handleFieldChange}
        className={clsx(classes.formField, {[classes.textAreaField]: multiline }, className)}
      />
      <FieldMessage
        isValid={isValid}
        description={description}
        errorMessages={errorMessages}
      />
    </FormControl>
  );
}

export default function TextFieldWithClipboardSupport(props) {
  const { copyToClipboard, value, subSectionField, className} = props;
  const classes = useStyles();
  const [enquesnackbar] = useEnqueueSnackbar();

  const handleCopy = useCallback(() =>
    enquesnackbar({ message: 'Copied to clipboard' }), [enquesnackbar]);

  if (copyToClipboard) {
    return (
      <div className={classes.dynaFieldCopyClipboard}>
        <DynaText {...props} />
        <CopyToClipboard text={value} onCopy={handleCopy}>
          <IconButtonWithTooltip
            data-test="copyToClipboard"
            tooltipProps={{title: 'Copy to clipboard'}}
            buttonSize={{size: 'small'}}
            className={classes.copyButton}>
            <CopyIcon />
          </IconButtonWithTooltip>
        </CopyToClipboard>
      </div>
    );
  }

  // copyToClipboard used to copy the value from clipboard.
  // subsectionfield used to add the padding to the field.
  return (
    <div
      className={clsx(classes.dynaFieldWrapper, className, {
        [classes.subSection]: subSectionField,
      })}>
      <DynaText {...props} className={classes.textFieldWithClipBoard} />
    </div>
  );
}

