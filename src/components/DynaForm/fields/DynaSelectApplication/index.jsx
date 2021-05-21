import React, { useMemo, useRef, useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import { FormControl, InputLabel } from '@material-ui/core';
import Select, { components } from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../../../reducers';
import { applicationsList, groupApplications } from '../../../../constants/applications';
import ApplicationImg from '../../../icons/ApplicationImg';
import AppPill from './AppPill';
import FieldMessage from '../FieldMessage';
import SearchIcon from '../../../icons/SearchIcon';
import actions from '../../../../actions';
import useFormContext from '../../../Form/FormContext';
import { isNewId } from '../../../../utils/resource';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles(theme => ({
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  optionRoot: {
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    wordBreak: 'break-word',
    padding: '0px',
  },
  optionImg: {
    width: '120px',
    display: 'flex',
    float: 'left',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    color: theme.palette.secondary.lightest,
    height: '100%',
  },
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
    height: '100%',
  },
  inputLabel: {
    transform: 'unset',
    position: 'static',
  },
  img: {
    maxWidth: '100%',
    padding: '0px 16px',
  },
  selectedContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2),
  },
  formControl: {
    width: '100%',
  },
}));

export const isLoadingANewConnectionForm = ({fieldMeta, operation, resourceType, resourceId }) => {
  // if its new resourceId and its of connections resourceType having a single field
  // its probably a new connections resource form
  const isNew = isNewId(resourceId);

  if (fieldMeta?.fieldMap &&
     Object.keys(fieldMeta?.fieldMap)?.length === 1 &&
     isNew &&
      operation === 'add' && resourceType === 'connections') {
    return true;
  }

  return false;
};
export default function SelectApplication(props) {
  const {
    disabled,
    appType,
    id,
    isMulti,
    name,
    label,
    flowId,
    options: fieldOptions,
    resourceType,
    resourceId,
    value = isMulti ? [] : '',
    placeholder,
    onFieldChange,
    formKey,
  } = props;
  const match = useRouteMatch();
  const classes = useStyles();
  const theme = useTheme();
  const ref = useRef(null);
  const isDataLoader = useSelector(state =>
    selectors.isDataLoader(state, flowId)
  );
  const data = useSelector(state =>
    selectors.resourceData(state, resourceType, resourceId)
  );
  const connectorApplications = data?.merged?.applications;

  const {fieldMeta} = useFormContext(formKey);
  const { operation } = match.params;
  const proceedOnChange = isLoadingANewConnectionForm({fieldMeta, operation, resourceType, resourceId});

  const groupedApps = useMemo(
    () =>
      groupApplications(resourceType, {
        appType: appType || (fieldOptions && fieldOptions.appType),
        isSimpleImport: isDataLoader,
      }),
    [appType, fieldOptions, isDataLoader, resourceType]
  );

  if (connectorApplications) {
    groupedApps.forEach((groupedApp, i) => {
      groupedApps[i].connectors = groupedApp.connectors.filter(connector => connectorApplications.includes(connector.assistant || connector.type));
    });
  }

  // Custom styles for Select Control
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: '0px',
      color: state.isSelected
        ? theme.palette.secondary.main
        : theme.palette.secondary.light,
      backgroundColor:
        state.isSelected || state.isFocused
          ? theme.palette.background.paper2
          : theme.palette.background.paper,
      border: 'none',
      minHeight: '38px',
      '&:active': {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.secondary.light,
      },
    }),
    control: provided => ({
      ...provided,
      borderColor: theme.palette.secondary.lightest,
      boxShadow: 'none',
      borderRadius: 2,
      '&:hover': {
        borderColor: theme.palette.primary.main,
      },
    }),
    menu: provided => ({
      ...provided,
      border: '1px solid',
      boxShadow: 'none',
      borderColor: theme.palette.secondary.lightest,
      marginTop: 0,
      borderRadius: '0px 0px 2px 2px',
    }),
    input: () => ({
      color: theme.palette.secondary.light,
      // marginLeft: 3,
    }),
    placeholder: () => ({
      color: theme.palette.secondary.light,
      position: 'absolute',
      height: '100%',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    menuList: () => ({
      padding: '0px',
      maxHeight: 'calc(100vh - 320px)',
      overflowY: 'auto',
    }),
    group: () => ({
      padding: '0px',
    }),
    groupHeading: () => ({
      textAlign: 'center',
      fontSize: '12px',
      padding: '5px',
      borderBottom: '1px solid',
      borderColor: theme.palette.divider,
      background: theme.palette.secondary.lightest,
      color: theme.palette.text.secondary,
    }),
    dropdownIndicator: () => ({
      color: theme.palette.secondary.light,
      padding: theme.spacing(0.5, 1, 0, 1),
      cursor: 'pointer',
      '&:hover': {
        color: fade(theme.palette.secondary.light, 0.8),
      },
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
      const color = theme.palette.secondary.light;

      return { ...provided, opacity, transition, color };
    },
  };
  const options = groupedApps.map(group => ({
    label: group.label,
    options: group.connectors.map(app => ({
      value: app.id,
      type: app.type,
      icon: app.icon || app.assistant,
      label: app.name,
      keywords: app.keywords,
      assistant: app.assistant,
    })),
  }));

  const DropdownIndicator = props => (
    <components.DropdownIndicator {...props}>
      <SearchIcon />
    </components.DropdownIndicator>
  );
  const Option = props => {
    const { type, icon, value } = props.data;

    const {dataPublic} = props.selectProps || {};

    return (
      <div data-test={props.label} className={classes.optionRoot}>
        <components.Option {...props}>
          <span className={classes.optionImg}>
            <ApplicationImg
              markOnly
              type={type === 'webhook' ? value : type}
              assistant={icon}
              className={classes.img}
            />
          </span>
          <span data-public={!!dataPublic} className={classes.optionLabel}>{props.label}</span>
        </components.Option>
      </div>
    );
  };

  const filterOptions = (candidate, input) => {
    if (input) {
      const term = input.toLowerCase();
      const { label, keywords } = candidate.data;

      return (
        (label && label.toLowerCase().includes(term)) ||
        (keywords && keywords.includes(term))
      );
    }

    return true;
  };
  const applications = applicationsList();

  const defaultValue =
    !value || isMulti
      ? ''
      : {
        value,
        label: applications.find(a => a.id === value).name,
      };

  const dispatch = useDispatch();
  const handleChange = useCallback(e => {
    ref?.current?.select?.blur();
    const newValue = isMulti ? [...value, e.value] : e.value;

    if (onFieldChange) {
      onFieldChange(id, newValue);
    }
    // when proceedOnChange is true
    // it means this form contains only this one field
    // we dispatch form submit as soon as the new value is vetted
    if (proceedOnChange && applications.find(a => a.id === newValue)) {
      const values = {};

      values[id] = newValue;
      dispatch(
        actions.resourceForm.submit(
          resourceType,
          resourceId,
          values,
          match,
          false,
          false,
          flowId
        )
      );
    }
  }, [isMulti, value, onFieldChange, proceedOnChange, applications, id, dispatch, resourceType, resourceId, match, flowId]);

  const handleFocus = useCallback(() => {
    const refState = ref?.current?.state;
    const inputValue = refState.value?.label;

    if (inputValue) {
      refState.inputValue = inputValue;
    }
  }, []);

  function handleRemove(index) {
    const newApps = [...value];

    newApps.splice(index, 1);
    onFieldChange(id, newApps);
  }

  return (
    <FormControl
      data-test={id}
      key={id}
      disabled={disabled}
      className={classes.formControl}>
      <div className={classes.fieldWrapper}>
        <InputLabel shrink className={classes.inputLabel} htmlFor={id}>
          {label}
        </InputLabel>
        <FieldHelp {...props} />
      </div>
      <Select
        dataPublic
        ref={ref}
        name={name}
        placeholder={placeholder}
        closeMenuOnSelect
        components={{ Option, DropdownIndicator }}
        defaultValue={defaultValue}
        defaultMenuIsOpen={!value}
        options={options}
        onChange={handleChange}
        onFocus={handleFocus}
        // onBlur={handleBlur}
        styles={customStyles}
        filterOption={filterOptions}
      />

      <FieldMessage {...props} />

      {isMulti && value.length > 0 && (
        <div className={classes.selectedContainer}>
          {value.map((appId, i) => (
            <AppPill
              // i think we are ok to add index when a user selects multiple
              // same applications. Even if a user deletes a matching app, the
              // keys would still work out. Not sure how else to assign keys here.
              // eslint-disable-next-line react/no-array-index-key
              key={`${appId}-${i}`}
              appId={appId}
              onRemove={() => handleRemove(i)}
            />
          ))}
        </div>
      )}
    </FormControl>
  );
}
