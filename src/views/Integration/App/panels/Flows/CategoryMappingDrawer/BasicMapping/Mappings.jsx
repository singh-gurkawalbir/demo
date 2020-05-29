/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { components } from 'react-select';
import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import * as selectors from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import ActionButton from '../../../../../../../components/ActionButton';
import LockIcon from '../../../../../../../components/icons/LockIcon';
import MappingSettings from '../../../../../../../components/AFE/ImportMappingSettings/MappingSettingsField';
import TrashIcon from '../../../../../../../components/icons/TrashIcon';
import DynaTypeableSelect from '../../../../../../../components/DynaForm/fields/DynaTypeableSelect';
import PreferredIcon from '../../../../../../../components/icons/PreferredIcon';
import ConditionalIcon from '../../../../../../../components/icons/ConditionalIcon';
import OptionalIcon from '../../../../../../../components/icons/OptionalIcon';
import RequiredIcon from '../../../../../../../components/icons/RequiredIcon';
import MappingConnectorIcon from '../../../../../../../components/icons/MappingConnectorIcon';
import DynaText from '../../../../../../../components/DynaForm/fields/DynaText';
import Help from '../../../../../../../components/Help';

// TODO Azhar style header
const useStyles = makeStyles(theme => ({
  root: {
    overflowY: 'off',
  },
  header: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  rowContainer: {
    display: 'block',
    padding: '0px',
  },
  child: {
    '& + div': {
      width: '100%',
    },
  },
  childHeader: {
    '& > div': {
      width: '100%',
    },
  },
  innerRow: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  mappingsBody: {
    height: `calc(100% - 32px)`,
    overflow: 'visible',
  },
  childRow: {
    display: 'flex',
    position: 'relative',
  },
  disableChildRow: {
    cursor: 'not-allowed',
    // TODO: (Aditya) Temp fix. To be removed on changing Import Mapping as Dyna Form
    '& > div > div > div': {
      background: theme.palette.secondary.lightest,
    },
  },
  lockIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },

  filterTypeIcon: {
    width: 9,
    height: 9,
    marginRight: 6,
  },
  PreferredIcon: {
    color: theme.palette.warning.main,
  },
  OptionalIcon: {
    color: theme.palette.secondary.lightest,
  },
  ConditionalIcon: {
    color: theme.palette.primary.main,
  },
  RequiredIcon: {
    color: theme.palette.error.main,
  },

  mappingIcon: {
    color: theme.palette.secondary.lightest,
    fontSize: 38,
  },
  mapField: {
    display: 'flex',
    position: 'relative',
    width: '40%',
  },
  dynaTextContainer: {
    padding: 0,
    display: 'flex',
    '& > .MuiFilledInput-multiline': {
      minHeight: '48px',
      padding: theme.spacing(1),
      '& >:nth-child(1)': {
        margin: 0,
        minWidth: 0,
      },
      '& >:nth-child(2)': {
        minHeight: `16px !important`,
        wordBreak: 'break-word',
      },
    },
  },

  mappingActionsCategory: {
    marginTop: theme.spacing(1),
    display: 'flex',
  },

  helpTextButtonCategroryMapping: {
    padding: 0,
    marginLeft: theme.spacing(1),
    '& svg': {
      fontSize: theme.spacing(3),
      marginTop: theme.spacing(-0.5),
    },
    '&:hover': {
      background: 'none',
      '& svg': {
        color: theme.palette.primary.main,
      },
    },
  },
}));

export default function ImportMapping(props) {
  // generateFields and extractFields are passed as an array of field names
  const {
    editorId,
    application,
    integrationId,
    flowId,
    generateFields = [],
    disabled,
    sectionId,
    options = {},
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { attributes = {}, mappingFilter = 'mapped' } =
    useSelector(state =>
      selectors.categoryMappingFilters(state, integrationId, flowId)
    ) || {};
  const { mappings, lookups, initChangeIdentifier } = useSelector(state =>
    selectors.categoryMappingsForSection(state, integrationId, flowId, editorId)
  );
  const { fields = [] } =
    useSelector(state =>
      selectors.categoryMappingGenerateFields(state, integrationId, flowId, {
        sectionId,
      })
    ) || {};
  const { extractsMetadata: extractFields } = useSelector(state =>
    selectors.categoryMappingMetadata(state, integrationId, flowId)
  );
  const mappingsCopy = mappings ? [...mappings] : [];

  mappingsCopy.push({});
  const tableData = (mappingsCopy || []).map((value, index) => {
    const obj = value;

    obj.index = index;
    let visible = true;
    const field = fields.find(f => f.id === obj.generate);

    if (field) {
      visible = visible && attributes[field.filterType];
    }

    if (mappingFilter === 'mapped') {
      visible =
        visible && (!!obj.extract || !!obj.hardCodedValue) && !!obj.generate;
    } else if (mappingFilter === 'unmapped') {
      visible = visible && !obj.extract;
    }

    if (obj.hardCodedValue) {
      obj.hardCodedValueTmp = `"${obj.hardCodedValue}"`;
    }

    obj.visible = visible;

    return obj;
  });
  const handleFieldUpdate = useCallback(
    (rowIndex, event, field) => {
      const { value } = event.target;

      dispatch(
        actions.integrationApp.settings.categoryMappings.patchField(
          integrationId,
          flowId,
          editorId,
          field,
          rowIndex,
          value
        )
      );
    },
    [dispatch, editorId]
  );
  const patchSettings = (row, settings) => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.patchSettings(
        integrationId,
        flowId,
        editorId,
        row,
        settings
      )
    );
  };

  const handleDelete = row => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.delete(
        integrationId,
        flowId,
        editorId,
        row
      )
    );
  };

  const updateLookupHandler = (lookupOps = []) => {
    let lookupsTmp = [...lookups];
    // Here lookupOPs will be an array of lookups and actions. Lookups can be added and delted simultaneously from settings.

    lookupOps.forEach(({ isDelete, obj }) => {
      if (isDelete) {
        lookupsTmp = lookupsTmp.filter(lookup => lookup.name !== obj.name);
      } else {
        const index = lookupsTmp.findIndex(lookup => lookup.name === obj.name);

        if (index !== -1) {
          lookupsTmp[index] = obj;
        } else {
          lookupsTmp.push(obj);
        }
      }
    });

    dispatch(
      actions.integrationApp.settings.categoryMappings.updateLookup(
        integrationId,
        flowId,
        editorId,
        lookupsTmp
      )
    );
  };

  const handleGenerateUpdate = mapping => (id, val) => {
    handleFieldUpdate(mapping.index, { target: { value: val } }, 'generate');
  };

  const TextContainer = ({ options, onFieldChange, ...props }) => {
    const [textvalue, setValue] = useState(props.value);
    const handleValueChange = (id, val) => {
      onFieldChange(id, val);
      setValue(val);
    };

    const { filterType } =
      options.find(option => option.name === textvalue) || {};
    let icon;

    switch (filterType) {
      case 'preferred':
        icon = (
          <PreferredIcon
            className={clsx(classes.filterTypeIcon, classes.PreferredIcon)}
          />
        );
        break;
      case 'optional':
        icon = (
          <OptionalIcon
            className={clsx(classes.filterTypeIcon, classes.OptionalIcon)}
          />
        );
        break;
      case 'required':
        icon = (
          <RequiredIcon
            className={clsx(classes.filterTypeIcon, classes.RequiredIcon)}
          />
        );
        break;
      case 'conditional':
        icon = (
          <ConditionalIcon
            className={clsx(classes.filterTypeIcon, classes.ConditionalIcon)}
          />
        );
        break;
      default:
        icon = null;
        break;
    }

    return (
      <DynaText
        {...props}
        startAdornment={icon}
        onFieldChange={handleValueChange}
        className={classes.dynaTextContainer}
      />
    );
  };

  const FieldHelp = ({ id }) => {
    const field = generateFields.find(f => f.id === id);
    const { name: title, description = 'No Description available.' } =
      field || {};

    return (
      <Help
        title={title}
        disabled={!field}
        className={classes.helpTextButtonCategroryMapping}
        helpKey={`categoryMappings-${id}`}
        helpText={description}
      />
    );
  };

  const ValueContainer = ({ children, ...props }) => {
    const value = props.selectProps.inputValue;
    const { filterType } =
      props.options.find(option => option.label === value) || {};

    return (
      <components.ValueContainer {...props}>
        {(() => {
          // TODO: Azhar Replace these arrow icons with new icons for ["Preferred", "optional", "conditional", "required"]
          switch (filterType) {
            case 'preferred':
              return (
                <PreferredIcon
                  className={clsx(
                    classes.filterTypeIcon,
                    classes.PreferredIcon
                  )}
                />
              );
            case 'optional':
              return (
                <OptionalIcon
                  className={clsx(classes.filterTypeIcon, classes.OptionalIcon)}
                />
              );
            case 'conditional':
              return (
                <ConditionalIcon
                  className={clsx(
                    classes.filterTypeIcon,
                    classes.ConditionalIcon
                  )}
                />
              );
            case 'required':
              return (
                <RequiredIcon
                  className={clsx(classes.filterTypeIcon, classes.RequiredIcon)}
                />
              );
            default:
              return null;
          }
        })()}
        {children}
      </components.ValueContainer>
    );
  };

  return (
    <div
      className={classes.root}
      key={`mapping-${editorId}-${initChangeIdentifier}`}>
      <div className={classes.mappingsBody}>
        {tableData
          .filter(mapping => mapping.visible)
          .map(mapping => (
            <div className={classes.rowContainer} key={mapping.index}>
              <div className={classes.innerRow}>
                <div
                  className={clsx(classes.childHeader, classes.mapField, {
                    [classes.disableChildRow]: mapping.isRequired || disabled,
                  })}>
                  <DynaTypeableSelect
                    key={`generate-${editorId}-${initChangeIdentifier}-${mapping.rowIdentifier}`}
                    id={`fieldMappingGenerate-${mapping.index}`}
                    value={mapping.generate}
                    labelName="name"
                    valueName="id"
                    components={{
                      ValueContainer,
                    }}
                    TextComponent={TextContainer}
                    options={generateFields}
                    disabled={mapping.isRequired || disabled}
                    onBlur={handleGenerateUpdate(mapping)}
                  />
                  {mapping.isRequired && (
                    <Tooltip
                      title="This field is required by the application you are importing into"
                      placement="top">
                      <span className={classes.lockIcon}>
                        <LockIcon />
                      </span>
                    </Tooltip>
                  )}
                </div>
                <MappingConnectorIcon className={classes.mappingIcon} />
                <div
                  className={clsx(classes.childHeader, classes.mapField, {
                    [classes.disableChildRow]:
                      mapping.isNotEditable || disabled,
                  })}>
                  <DynaTypeableSelect
                    key={`extract-${editorId}-${initChangeIdentifier}-${mapping.rowIdentifier}`}
                    id={`fieldMappingExtract-${mapping.index}`}
                    labelName="name"
                    valueName="id"
                    value={mapping.extract || mapping.hardCodedValueTmp}
                    options={extractFields}
                    disabled={mapping.isNotEditable || disabled}
                    components={{ ItemSeperator: () => null }}
                    onBlur={(id, evt) => {
                      handleFieldUpdate(
                        mapping.index,
                        { target: { value: evt } },
                        'extract'
                      );
                    }}
                  />

                  {mapping.isNotEditable && (
                    <span className={classes.lockIcon}>
                      <LockIcon />
                    </span>
                  )}
                </div>
                <div className={classes.mappingActionsCategory}>
                  <div>
                    <MappingSettings
                      id={`fieldMappingSettings-${mapping.index}`}
                      onSave={(id, evt) => {
                        patchSettings(mapping.index, evt);
                      }}
                      value={mapping}
                      options={options}
                      generate={mapping.generate}
                      application={application}
                      isCategoryMapping
                      updateLookup={updateLookupHandler}
                      disabled={mapping.isNotEditable || disabled}
                      lookups={lookups}
                      extractFields={extractFields}
                      generateFields={generateFields}
                    />
                  </div>
                  <div key="delete_button">
                    <ActionButton
                      data-test={`fieldMappingRemove-${mapping.index}`}
                      aria-label="delete"
                      disabled={
                        mapping.isRequired || mapping.isNotEditable || disabled
                      }
                      onClick={() => {
                        handleDelete(mapping.index);
                      }}>
                      <TrashIcon />
                    </ActionButton>
                  </div>
                  <div>
                    <FieldHelp id={mapping.generate} />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
