/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
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
  refreshButton: {
    marginLeft: theme.spacing(1),
    marginRight: 0,
  },
  spinner: {
    marginLeft: 5,
    width: 50,
    height: 50,
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
    color: theme.palette.success.main,
  },
  mappingIcon: {
    color: theme.palette.secondary.lightest,
    fontSize: theme.spacing(6),
  },
  mapField: {
    display: 'flex',
    position: 'relative',
    width: '40%',
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
    options = {},
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { mappings, lookups, initChangeIdentifier } = useSelector(state =>
    selectors.categoryMappingsForSection(state, integrationId, flowId, editorId)
  );
  const { extractsMetadata: extractFields } = useSelector(state =>
    selectors.categoryMappingMetadata(state, integrationId, flowId)
  );
  const mappingsCopy = mappings ? [...mappings] : [];

  mappingsCopy.push({});
  const tableData = (mappingsCopy || []).map((value, index) => {
    const obj = value;

    obj.index = index;

    if (obj.hardCodedValue) {
      obj.hardCodedValueTmp = `"${obj.hardCodedValue}"`;
    }

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

  const updateLookupHandler = (isDelete, obj) => {
    let lookupsTmp = [...lookups];

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
        {tableData.map(mapping => (
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
                  [classes.disableChildRow]: mapping.isNotEditable || disabled,
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
                  }}
                  className={classes.margin}>
                  <TrashIcon />
                </ActionButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
