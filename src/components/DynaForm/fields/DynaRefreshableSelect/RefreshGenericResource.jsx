import { useEffect, useState, cloneElement, useCallback } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
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
  inlineElements: {
    display: 'flex',
    flexDirection: `row !important`,
  },
  label: {
    '& + div': {
      width: '100%',
    },
  },
  refreshButton: {
    marginLeft: 5,
    marginRight: 0,
  },
  spinner: {
    marginLeft: 5,
    width: 50,
    height: 50,
  },
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    transitionProperty: 'border',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    overflow: 'hidden',
    height: 50,
    justifyContent: 'flex-end',
    borderRadius: 2,
    '& > Label': {
      paddingTop: 10,
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '& > *': {
      padding: [[0, 12]],
    },
    '& > div > div ': {
      paddingBottom: 5,
    },
    '& svg': {
      right: 8,
    },
  },
  selectElement: {
    width: '80%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(0.25),
  },
}));

/**
 *
 * disabled property is part of props being send from Form factory
 * setting disableOptionsLoad = false will restrict fetch of resources
 */
export default function RefreshGenericResource(props) {
  const {
    description,
    disabled,
    disableOptionsLoad,
    id,
    label,
    resourceToFetch,
    resetValue,
    multiselect,
    onFieldChange,
    fieldData,
    fieldStatus,
    handleFetchResource,
    handleRefreshResource,
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
    if (!fieldData && !disableOptionsLoad && handleFetchResource) {
      handleFetchResource();
    }
  }, [disableOptionsLoad, fieldData, handleFetchResource]);

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

  const options = (fieldData || []).map(options => {
    const { label, value } = options;

    return { label, value };
  });

  return (
    <div>
      <FormControl
        key={id}
        disabled={disabled}
        className={classes.inlineElements}>
        <InputLabel shrink htmlFor={id} className={classes.label}>
          {label}
        </InputLabel>
        {cloneElement(children, {
          ...props,
          options: [{ items: options || [] }],
        })}
        {!isLoading && !removeRefresh && (
          <ActionButton
            onClick={handleRefreshResource}
            className={classes.refreshButton}
            data-test="refreshResource">
            <RefreshIcon />
          </ActionButton>
        )}
        {fieldData && isLoading && (
          <span className={classes.spinner}>
            <Spinner size={48} color="primary" />
          </span>
        )}
        {urlToOpen && (
          <ActionButton
            onClick={handleOpenResource}
            className={classes.refreshButton}
            data-test="openResource">
            <ExitIcon />
          </ActionButton>
        )}
        {description && <FormHelperText>{description}</FormHelperText>}
        {fieldError && (
          <FormHelperText error="true">{fieldError}</FormHelperText>
        )}
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
