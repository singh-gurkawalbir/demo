/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { components } from 'react-select';
import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import MappingSettings from '../../../../../../components/AFE/ImportMappingSettings/MappingSettingsField';
import TrashIcon from '../../../../../../components/icons/TrashIcon';
import * as selectors from '../../../../../../reducers';
import ActionButton from '../../../../../../components/ActionButton';
import LockIcon from '../../../../../../components/icons/LockIcon';
import actions from '../../../../../../actions';
import DynaTypeableSelect from '../../../../../../components/DynaForm/fields/DynaTypeableSelect';
import AddIcon from '../../../../../../components/icons/AddIcon';
import ArrowRightIcon from '../../../../../../components/icons/ArrowRightIcon';
import ArrowLeftIcon from '../../../../../../components/icons/ArrowLeftIcon';
import ArrowDownIcon from '../../../../../../components/icons/ArrowDownIcon';

// TODO Azhar style header
const useStyles = makeStyles(theme => ({
  root: {
    overflowY: 'off',
  },
  header: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '45% 45% 50px 50px',
    gridColumnGap: '1%',
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
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '40% 40% 50px 50px',
    marginBottom: theme.spacing(1),
    gridColumnGap: '1%',
  },
  mappingsBody: {
    height: `calc(100% - 32px)`,
    overflow: 'auto',
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
}));

export default function ImportMapping(props) {
  // generateFields and extractFields are passed as an array of field names
  const {
    editorId,
    application,
    generateFields = [],
    extractFields = [],
    disabled,
    options = {},
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { mappings, lookups, initChangeIdentifier } = useSelector(state =>
    selectors.mapping(state, editorId)
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

      dispatch(actions.mapping.patchField(editorId, field, rowIndex, value));
    },
    [dispatch, editorId]
  );
  const patchSettings = (row, settings) => {
    dispatch(actions.mapping.patchSettings(editorId, row, settings));
  };

  const handleDelete = row => {
    dispatch(actions.mapping.delete(editorId, row));
  };

  const getLookup = name => lookups.find(lookup => lookup.name === name);
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

    dispatch(actions.mapping.updateLookup(editorId, lookupsTmp));
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
              return <ArrowDownIcon />;
            case 'optional':
              return <ArrowLeftIcon />;
            case 'conditional':
              return <ArrowRightIcon />;
            case 'required':
              return <AddIcon />;
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
                className={clsx(classes.childHeader, classes.childRow, {
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
                    title="This field is required by the application you are importing to"
                    placement="top">
                    <span className={classes.lockIcon}>
                      <LockIcon />
                    </span>
                  </Tooltip>
                )}
              </div>
              <div
                className={clsx(classes.childHeader, classes.childRow, {
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
                  lookup={
                    mapping &&
                    mapping.lookupName &&
                    getLookup(mapping.lookupName)
                  }
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
