import React, { useEffect, useState, cloneElement, useCallback, useMemo } from 'react';
import FormControl from '@mui/material/FormControl';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import RefreshIcon from '../../../../icons/RefreshIcon';
import DynaSelect from '../../DynaSelect';
import DynaMultiSelect from '../../DynaMultiSelect';
import ActionButton from '../../../../ActionButton';
import ExitIcon from '../../../../icons/ExitIcon';
import openExternalUrl from '../../../../../utils/window';
import FieldMessage from '../../FieldMessage';

const useStyles = makeStyles(theme => ({
  refreshGenericResourceWrapper: {
    display: 'flex',
    flexDirection: 'row !important',
  },
  refreshGenericResourceActionBtn: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
  },
  refreshLoader: {
    marginLeft: theme.spacing(1),
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
export default function RefreshGenericResource(props) {
  const {
    description,
    disabled,
    disableOptionsLoad,
    id,
    resourceToFetch,
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
        className={classes.refreshGenericResourceWrapper}>

        <div className={classes.refreshRoot}>
          {cloneElement(children, {
            ...props,
            options,
          })}
        </div>
        {!isLoading && !removeRefresh && (
          <ActionButton
            onClick={onRefresh}
            tooltip="Refresh"
            className={classes.refreshGenericResourceActionBtn}
            data-test="refreshResource">
            <RefreshIcon />
          </ActionButton>
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
  const { multiselect } = props;

  return (
    <RefreshGenericResource {...props}>
      {multiselect ? <DynaMultiSelect /> : <DynaSelect />}
    </RefreshGenericResource>
  );
}
