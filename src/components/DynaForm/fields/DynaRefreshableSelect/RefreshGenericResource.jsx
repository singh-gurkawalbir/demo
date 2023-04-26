import React, { useEffect, useState, cloneElement, useCallback, useMemo } from 'react';
import FormControl from '@mui/material/FormControl';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import RefreshIcon from '../../../icons/RefreshIcon';
import DynaSelect from '../DynaSelect';
import DynaMultiSelect from '../DynaMultiSelect';
import ActionButton from '../../../ActionButton';
import ExitIcon from '../../../icons/ExitIcon';
import openExternalUrl from '../../../../utils/window';
import FieldMessage from '../FieldMessage';
import IconButtonWithTooltip from '../../../IconButtonWithTooltip';

const useStyles = makeStyles(theme => ({
  refreshGenericResourceWrapper: {
    display: 'flex',
    flexDirection: 'row !important',
  },
  refreshGenericResourceActionBtn: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing(3),
    padding: theme.spacing(1),
  },
  refreshLoader: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(0.5),
  },
  refreshRoot: {
    width: '100%',
    overflow: 'hidden',
  },
}));

/**
 *
 * disabled property is part of props being send from Form factory
 * setting disableOptionsLoad = false will restrict fetch of resources
 */

// TODO need to redesign this component to be flexible to read config and render
// children in required sequence. Currently we are overloading this and child
// components are hardcoded in it making this inflexible to extend.

// multiselect default value is []
const isValueEqualDefaultValue = value => (value === '');
export default function RefreshGenericResource(props) {
  const {
    description,
    disabled,
    disableOptionsLoad,
    id,
    resourceToFetch,
    ignoreValueUnset = false,
    resetValue,
    multiselect,
    onFieldChange,
    fieldData,
    fieldStatus,
    onFetch,
    onRefresh,
    fieldError,
    children,
    removeRefresh = false,
    urlToOpen,
    value,
    className,
  } = props;

  const classes = useStyles();
  const defaultValue = props.defaultValue || (multiselect ? [] : '');
  // component is in loading state in both request and refresh cases
  const isLoading =
    !disableOptionsLoad &&
    (!fieldStatus ||
      fieldStatus === 'requested' ||
      fieldStatus === 'refreshed');
  // Boolean state to minimize calls on useEffect
  const [isDefaultValueChanged, setIsDefaultValueChanged] = useState(false);

  // Resets field's value to value provided as argument
  useEffect(() => {
    if (isDefaultValueChanged) {
      if (resetValue) {
        onFieldChange(id, multiselect ? [] : '', true);
      } else {
        onFieldChange(id, defaultValue, true);
      }

      setIsDefaultValueChanged(false);
    }
  }, [
    id,
    resetValue,
    multiselect,
    defaultValue,
    isDefaultValueChanged,
    onFieldChange,
    setIsDefaultValueChanged,
  ]);
  useEffect(() => {
    if (!fieldData && !disableOptionsLoad && onFetch) {
      onFetch();
    }
  }, [disableOptionsLoad, fieldData, onFetch]);

  useEffect(() => {
    // Reset selected values on change of resourceToFetch
    if (resourceToFetch) {
      setIsDefaultValueChanged(true);
    }
  }, [resourceToFetch, setIsDefaultValueChanged]);

  const isSelectedValueInOptions = fieldData && fieldData.some(({value: optValue}) => value === optValue);

  useEffect(() => {
    // if selected option is not in options list then reset it to empty

    if (!ignoreValueUnset && !isLoading && !multiselect && !isSelectedValueInOptions && !isValueEqualDefaultValue(value)) {
      onFieldChange(id, '', true);
    }
  }, [id, isLoading, isSelectedValueInOptions, multiselect, onFieldChange, value, ignoreValueUnset]);

  const handleOpenResource = useCallback(() => {
    openExternalUrl({ url: urlToOpen });
  }, [urlToOpen]);

  const options = useMemo(() => [{ items: fieldData || [] }], [fieldData]);

  if (!fieldData && !disableOptionsLoad) return <Spinner />;

  return (
    <div>
      <FormControl
        variant="standard"
        key={id}
        disabled={disabled}
        className={clsx(classes.refreshGenericResourceWrapper, className)}>

        <div className={classes.refreshRoot}>
          {cloneElement(children, {
            ...props,
            options,
          })}
        </div>
        {!isLoading && !removeRefresh && (
          <IconButtonWithTooltip
            onClick={onRefresh}
            buttonSize="small"
            tooltipProps={{title: 'Refresh'}}
            className={classes.refreshGenericResourceActionBtn}
            data-test="refreshResource">
            <RefreshIcon />
          </IconButtonWithTooltip>
        )}
        {fieldData && isLoading && (
          <span
            className={clsx(
              classes.refreshGenericResourceActionBtn,
              classes.refreshLoader
            )}>
            <Spinner />
          </span>
        )}
        {urlToOpen && (
          <ActionButton
            onClick={handleOpenResource}
            className={classes.refreshGenericResourceActionBtn}
            data-test="openResource">
            <ExitIcon />
          </ActionButton>
        )}
      </FormControl>
      {fieldError && <FieldMessage errorMessages={fieldError} />}
      {description && <FieldMessage description={description} />}
    </div>
  );
}

export function DynaGenericSelect(props) {
  const { multiselect, ignoreValueUnset, disableOptionsLoad, fieldStatus } = props;
  // component is in loading state in both request and refresh cases
  const isLoading =
    !disableOptionsLoad &&
    (!fieldStatus ||
      fieldStatus === 'requested' ||
      fieldStatus === 'refreshed');

  return (
    <RefreshGenericResource {...props}>
      {multiselect ? <DynaMultiSelect removeInvalidValues={!ignoreValueUnset} isLoading={isLoading} /> : <DynaSelect />}
    </RefreshGenericResource>
  );
}
