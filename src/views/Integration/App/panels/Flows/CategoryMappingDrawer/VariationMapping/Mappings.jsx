/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { generateId } from '../../../../../../../utils/string';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import ActionButton from '../../../../../../../components/ActionButton';
import LockIcon from '../../../../../../../components/icons/LockIcon';
import TrashIcon from '../../../../../../../components/icons/TrashIcon';
import DynaTypeableSelect from '../../../../../../../components/DynaForm/fields/DynaTypeableSelect';
import MappingConnectorIcon from '../../../../../../../components/icons/MappingConnectorIcon';
import useSelectorMemo from '../../../../../../../hooks/selectors/useSelectorMemo';
import { emptyList } from '../../../../../../../constants';

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
    marginRight: theme.spacing(1),
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
    sectionId,
    depth,
    isVariationAttributes,
    disabled,
    categoryId,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { mappings } = useSelectorMemo(selectors.mkCategoryMappingsForSection, integrationId, flowId, editorId);
  const extractFields = useSelectorMemo(selectors.mkCategoryMappingsExtractsMetadata, integrationId, flowId);
  const { fields: sectionGenerateFields = emptyList } =
  useSelector(state => {
    const generatesMetadata = selectors.categoryMappingGenerateFields(
      state,
      integrationId,
      flowId,
      {
        sectionId,
        depth,
      }
    );

    if (isVariationAttributes) {
      const { variation_attributes: variationAttributes } = generatesMetadata;

      return { fields: variationAttributes };
    }

    return generatesMetadata;
  }) || {};

  const { fields: categoryGenerateFields = emptyList } =
  useSelector(state => selectors.categoryMappingGenerateFields(
    state,
    integrationId,
    flowId,
    {
      sectionId: categoryId,
    }
  )) || {};
  let generateFields;

  if (sectionId !== categoryId) {
    generateFields = [...categoryGenerateFields, ...sectionGenerateFields];
  } else {
    generateFields = sectionGenerateFields;
  }

  const tableData = useMemo(() => {
    const mappingsTemp = mappings ? [...mappings] : [];

    mappingsTemp.push({key: generateId()});

    return mappingsTemp;
  }, [mappings]);
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
  const handleDelete = key => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.delete(
        integrationId,
        flowId,
        editorId,
        key
      )
    );
  };

  const handleGenerateUpdate = mapping => (id, val) => {
    handleFieldUpdate(mapping.key, { target: { value: val } }, 'generate');
  };

  return (
    <div className={classes.root}>
      <div className={classes.mappingsBody}>
        {tableData.map(mapping => (
          <div className={classes.rowContainer} key={mapping.key}>
            <div className={classes.innerRow}>
              <div
                className={clsx(classes.childHeader, classes.mapField, {
                  [classes.disableChildRow]: mapping.isRequired || disabled,
                })}>
                <DynaTypeableSelect
                  id={`fieldMappingGenerate-${mapping.key}`}
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
                  id={`fieldMappingExtract-${mapping.key}`}
                  labelName="name"
                  valueName="id"
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
              <div key="delete_button">
                <ActionButton
                  data-test={`fieldMappingRemove-${mapping.key}`}
                  aria-label="delete"
                  disabled={
                    mapping.isRequired || mapping.isNotEditable || disabled
                  }
                  onClick={() => {
                    handleDelete(mapping.key);
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
