/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import * as selectors from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import ActionButton from '../../../../../../../components/ActionButton';
import LockIcon from '../../../../../../../components/icons/LockIcon';
import TrashIcon from '../../../../../../../components/icons/TrashIcon';
import DynaTypeableSelect from '../../../../../../../components/DynaForm/fields/DynaTypeableSelect';
import MappingConnectorIcon from '../../../../../../../components/icons/MappingConnectorIcon';

// TODO Azhar style header
const useStyles = makeStyles(theme => ({
  root: {
    overflowY: 'off',
  },
  deleteIcon: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
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
    height: 'calc(100% - 32px)',
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
  filterTypeIcon: {
    width: 9,
    height: 9,
    marginRight: 6,
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
}));

export default function ImportMapping(props) {
  // generateFields and extractFields are passed as an array of field names
  const {
    editorId,
    integrationId,
    flowId,
    generateFields = [],
    disabled,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { mappings, initChangeIdentifier } = useSelector(state =>
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

  const handleGenerateUpdate = mapping => (id, val) => {
    handleFieldUpdate(mapping.index, { target: { value: val } }, 'generate');
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
                  components={{ ItemSeperator: () => null }}
                  valueName="id"
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
                  className={classes.deleteIcon}>
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
