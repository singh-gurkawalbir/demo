import { useEffect, useState, cloneElement, useCallback } from 'react';
import FormControl from '@material-ui/core/FormControl';
import clsx from 'clsx';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import Spinner from '../../../Spinner';
import RefreshIcon from '../../../icons/RefreshIcon';
import DynaSelect from '../DynaSelect';
import DynaMultiSelect from '../DynaMultiSelect';
import ActionButton from '../../../ActionButton';
import ExitIcon from '../../../icons/ExitIcon';
import openExternalUrl from '../../../../utils/window';

const useStyles = makeStyles(theme => ({
  refreshGenericResourceWrapper: {
    display: 'flex',
    flexDirection: `row !important`,
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

  if (!fieldData && !disableOptionsLoad) return <Spinner />;

  return (
    <div>
      <FormControl
        key={id}
        disabled={disabled}
        className={classes.refreshGenericResourceWrapper}>
        <div className={classes.refreshRoot}>
          {cloneElement(children, {
            ...props,
            options: [{ items: fieldData || [] }],
          })}
        </div>
        {!isLoading && !removeRefresh && (
          <ActionButton
            onClick={onRefresh}
            className={classes.refreshGenericActionBtn}
            data-test="refreshResource">
            <RefreshIcon />
          </ActionButton>
        )}
        {fieldData && isLoading && (
          <span
            className={clsx(
              classes.refreshGenericActionBtn,
              classes.refreshLoader
            )}>
            <Spinner size={24} color="primary" />
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
        {description && <FormHelperText>{description}</FormHelperText>}
        {fieldError && <FormHelperText error>{fieldError}</FormHelperText>}
      </FormControl>
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
