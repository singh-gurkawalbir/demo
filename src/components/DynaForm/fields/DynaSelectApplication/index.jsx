import React, { useMemo, useRef, useCallback, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FormControl, InputLabel, Typography } from '@material-ui/core';
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
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import { ReactSelectUseStyles, CustomReactSelectStyles } from '../reactSelectStyles/styles';
import getImageUrl from '../../../../utils/image';
import TextButton from '../../../Buttons/TextButton';

const isLoadingANewConnectionForm = ({fieldMeta, operation, resourceType, resourceId }) => {
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
    isLoggable,
    formKey,
  } = props;
  const match = useRouteMatch();
  const classes = ReactSelectUseStyles();
  const ref = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(!value);
  const [inputValue, setInputValue] = useState();
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
          <span {...isLoggableAttr(isLoggable)} className={classes.optionLabel}>
            {props.label}
          </span>
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
        label: applications.find(a => a.id === value)?.name,
      };

  const dispatch = useDispatch();
  const handleChange = useCallback(e => {
    ref?.current?.select?.blur();
    const newValue = isMulti ? [...value, e.value] : e.value;
    const label = !isMulti && e.label;

    setInputValue(value.label);
    setMenuIsOpen(false);
    if (onFieldChange) {
      onFieldChange(id, newValue);
    }
    // when proceedOnChange is true
    // it means this form contains only this one field
    // we dispatch form submit as soon as the new value is vetted
    if (proceedOnChange && applications.find(a => a.id === newValue)) {
      const values = {};

      values[id] = newValue;
      values.name = label;
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

  const NoOptionsMessage = props => {
    const imagePath = getImageUrl('images/react/empty-states/connections.png');

    return (
      <div className={classes.emptyOptionMessage}>
        <components.NoOptionsMessage className={classes.emptyMessage} {...props} />
        <img
          className={classes.appLogo}
          src={imagePath}
          type="connections"
          alt="" />

        <Typography variant="body2">
          {`We weren't able to find "${inputValue}"`}
        </Typography>
        <Typography variant="body2">
          Try using
          <TextButton
            onClick={() => {
              const universalConnectorOptions = options[1]?.options;
              const httpOptionProps = universalConnectorOptions?.find(option => option.value === 'http');

              const refState = ref?.current?.state;

              refState.value = httpOptionProps;
              handleChange({value: 'http', label: 'HTTP'});
            }}
            color="primary">HTTP
          </TextButton>
          connector
        </Typography>
      </div>
    );
  };

  const handleFocus = useCallback(() => {
    const refState = ref?.current?.state;
    const inputValue = refState?.value?.label;

    if (inputValue) {
      setInputValue(inputValue);
    }
    setMenuIsOpen(true);
  }, []);

  function handleRemove(index) {
    const newApps = [...value];

    newApps.splice(index, 1);
    onFieldChange(id, newApps);
  }

  const handleInputChange = (newVal, event) => {
    if (event.action === 'input-change') {
      setInputValue(newVal);
    }
  };

  const handleBlur = () => {
    const refState = ref?.current?.state;
    const selectedValue = refState?.value?.label;

    if (selectedValue) {
      setInputValue(selectedValue);
    }
    setMenuIsOpen(!value);
  };

  const customReactSelectStyles = CustomReactSelectStyles();

  const mergedStyles = () => ({
    ...customReactSelectStyles,
    menuList: () => ({
      maxHeight: 'calc(100vh - 320px)',
      padding: '0px',
      overflowY: 'auto',
    }),
    input: () => ({
      padding: 0,
    }),
  });
  const customStyles = mergedStyles();

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
        {...isLoggableAttr(isLoggable)}
        ref={ref}
        name={name}
        inputValue={inputValue}
        placeholder={placeholder}
        closeMenuOnSelect
        components={{ Option, DropdownIndicator, NoOptionsMessage }}
        defaultValue={defaultValue}
        menuIsOpen={menuIsOpen}
        options={options}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onFocus={handleFocus}
        autoFocus
        onBlur={handleBlur}
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
