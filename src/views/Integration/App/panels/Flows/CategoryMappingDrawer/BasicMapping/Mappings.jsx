/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { components } from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ListIcon from '@material-ui/icons/List';
import shortid from 'shortid';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import ActionButton from '../../../../../../../components/ActionButton';
import MappingSettings from '../../../../../../../components/Mapping/Settings/SettingsButton';
import TrashIcon from '../../../../../../../components/icons/TrashIcon';
import DynaTypeableSelect from '../../../../../../../components/DynaForm/fields/DynaTypeableSelect';
import PreferredIcon from '../../../../../../../components/icons/PreferredIcon';
import ConditionalIcon from '../../../../../../../components/icons/ConditionalIcon';
import OptionalIcon from '../../../../../../../components/icons/OptionalIcon';
import RequiredIcon from '../../../../../../../components/icons/RequiredIcon';
import MappingConnectorIcon from '../../../../../../../components/icons/MappingConnectorIcon';
import DynaText from '../../../../../../../components/DynaForm/fields/DynaText';
import Help from '../../../../../../../components/Help';
import useSelectorMemo from '../../../../../../../hooks/selectors/useSelectorMemo';

// TODO Azhar style header
const useStyles = makeStyles(theme => ({
  root: {
    overflowY: 'off',
  },
  rowContainer: {
    display: 'block',
    padding: '0px',
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
    height: 'calc(100% - 32px)',
    overflow: 'visible',
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
        minHeight: '16px !important',
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

const ListIconComponent = ({ mapping, generateFields = [] }) => {
  const { generate } = mapping;
  const generateField = generateFields.find(f => f.id === generate);

  return generateField &&
    generateField.options &&
    generateField.options.length ? (
    // TODO: @Azhar should be replaced by a ListIcon
      <ListIcon />
    ) : null;
};

const TextContainer = ({ options, onFieldChange, ...props }) => {
  const classes = useStyles();
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

const FieldHelp = ({id, name, description = 'No Description available.' }) => {
  const classes = useStyles();

  return (
    <Help
      title={name}
      className={classes.helpTextButtonCategroryMapping}
      helpKey={`categoryMappings-${id}`}
      helpText={description}
    />
  );
};

const ValueContainer = ({ children, ...props }) => {
  const classes = useStyles();
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

export default function ImportMapping(props) {
  // generateFields and extractFields are passed as an array of field names
  const {
    editorId,
    integrationId,
    flowId,
    generateFields = [],
    sectionId,
    options = {},
    depth,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const memoizedOptions = useMemo(() => ({ sectionId, depth }), [sectionId, depth]);
  const { deleted: disabled = false } = useSelectorMemo(selectors.mkMappingsForCategory, integrationId, flowId, memoizedOptions) || {};
  const { attributes = {}, mappingFilter = 'mapped' } = useSelectorMemo(selectors.mkCategoryMappingFilters, integrationId, flowId) || {};
  const { mappings, initChangeIdentifier } = useSelectorMemo(selectors.mkCategoryMappingsForSection, integrationId, flowId, editorId, depth);
  const extractFields = useSelectorMemo(selectors.mkCategoryMappingsExtractsMetadata, integrationId, flowId);
  const mappingsCopy = mappings ? [...mappings] : [];

  const visibleAttributes = Object.keys(attributes).filter(key => attributes[key]);

  const tableData = useMemo(() => {
    const mappings = (mappingsCopy || [])
      .filter(field => {
        let visible = visibleAttributes.includes(field.filterType);

        if (mappingFilter === 'mapped') {
          visible = visible && (!!field.extract || !!field.hardCodedValue) && !!field.generate;
        } else if (mappingFilter === 'unmapped') {
          visible = visible && !field.extract && !field.hardCodedValue;
        }

        return visible;
      })
      .map((value, index) => {
        const obj = value;

        obj.index = index;

        if (obj.hardCodedValue) {
          obj.hardCodedValueTmp = `"${obj.hardCodedValue}"`;
        }

        return obj;
      });

    mappings.push({key: shortid.generate()});

    return mappings;
  }, [mappings, attributes, mappingFilter]);

  const handleFieldUpdate = useCallback(
    (mappingKey, event, field) => {
      const { value } = event.target;

      dispatch(
        actions.integrationApp.settings.categoryMappings.patchField(
          integrationId,
          flowId,
          editorId,
          field,
          mappingKey,
          value
        )
      );
    },
    [dispatch, editorId]
  );
  const handleDelete = useCallback(key => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.delete(
        integrationId,
        flowId,
        editorId,
        key
      )
    );
  }, [integrationId, flowId, editorId]);

  const handleGenerateUpdate = useCallback(mapping => (id, val) => {
    handleFieldUpdate(mapping.key, { target: { value: val } }, 'generate');
  }, []);

  return (
    <div
      key={`mapping-${editorId}-${initChangeIdentifier}`}
      className={classes.root}>
      <div className={classes.mappingsBody}>
        {tableData
          .map(mapping => (
            <div className={classes.rowContainer} key={mapping.key}>
              <div className={classes.innerRow}>
                <div
                  className={clsx(classes.childHeader, classes.mapField, {
                    [classes.disableChildRow]: mapping.isRequired || disabled,
                  })}>
                  <DynaTypeableSelect
                    key={`generate-${editorId}-${initChangeIdentifier}-${mapping.rowIdentifier}`}
                    id={`fieldMappingGenerate-${mapping.key}`}
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

                </div>
                <MappingConnectorIcon className={classes.mappingIcon} />
                <div
                  className={clsx(classes.childHeader, classes.mapField, {
                    [classes.disableChildRow]:
                      mapping.isNotEditable || disabled,
                  })}>

                  <DynaTypeableSelect
                    key={`extract-${editorId}-${mapping.extract || (mapping.hardCodedValue ? `"${mapping.hardCodedValue}"` : undefined)}`}
                    id={`fieldMappingExtract-${mapping.key}`}
                    labelName="name"
                    valueName="id"
                    endAdornment={(
                      <ListIconComponent
                        mapping={mapping}
                        extractFields={extractFields}
                        generateFields={generateFields}
                      />
                    )}
                    value={mapping.extract || (mapping.hardCodedValue ? `"${mapping.hardCodedValue}"` : undefined)}
                    options={extractFields}
                    disabled={mapping.isNotEditable || disabled}
                    components={{ ItemSeperator: () => null }}
                    onBlur={(id, evt) => {
                      handleFieldUpdate(
                        mapping.key,
                        { target: { value: evt } },
                        'extract'
                      );
                    }}
                  />

                </div>
                <div className={classes.mappingActionsCategory}>
                  <div>
                    <MappingSettings
                      dataTest={`fieldMappingSettings-${mapping.key}`}
                      isCategoryMapping
                      disabled={mapping.isNotEditable || disabled}
                      mappingKey={mapping.key}
                      integrationId={integrationId}
                      flowId={flowId}
                      depth={depth}
                      sectionId={sectionId}
                      editorId={editorId}
                      {...options}
                    />
                  </div>
                  <div key="delete_button">
                    <ActionButton
                      data-test={`fieldMappingRemove-${mapping.key}`}
                      aria-label="delete"
                      disabled={
                        (!mapping.extract && !mapping.hardCodedValue) || disabled
                      }
                      onClick={() => {
                        handleDelete(mapping.key);
                      }}>
                      <TrashIcon />
                    </ActionButton>
                  </div>
                  <div>
                    <FieldHelp
                      id={mapping.generate}
                      name={mapping.name}
                      description={mapping.description}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
