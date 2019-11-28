/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import MappingSettings from '../ImportMappingSettings/MappingSettingsField';
import DynaTypeableSelect from '../../DynaForm/fields/DynaTypeableSelect';
import mappingUtil from '../../../utils/mapping';
import TrashIcon from '../../icons/TrashIcon';
import * as selectors from '../../../reducers';
import ActionButton from '../../ActionButton';
import { adaptorTypeMap } from '../../../utils/resource';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },
  header: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '45% 45% 50px 50px',
    gridColumnGap: '1%',
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
    gridTemplateColumns: '45% 45% 50px 50px',
    marginBottom: theme.spacing(1),
    gridColumnGap: '1%',
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
    optionalHanlder,
    options = {},
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { fetchSalesforceSObjectMetadata } = optionalHanlder;
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

  const generateLabel = mappingUtil.getGenerateLabelForMapping(application);
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
    if (
      application === adaptorTypeMap.SalesforceImport &&
      val &&
      val.indexOf('_child_') > -1
    ) {
      const childRelationshipField = generateFields.find(
        field => field.id === val
      );

      if (childRelationshipField) {
        const { childSObject, relationshipName } = childRelationshipField;

        dispatch(
          actions.mapping.patchIncompleteGenerates(
            editorId,
            mapping.index,
            relationshipName
          )
        );
        fetchSalesforceSObjectMetadata(childSObject);
      }
    }

    handleFieldUpdate(mapping.index, { target: { value: val } }, 'generate');
  };

  return (
    <div
      className={classes.container}
      key={`mapping-${editorId}-${initChangeIdentifier}`}>
      <div className={classes.root}>
        <div className={classes.header}>
          <Typography varaint="h4" className={classes.childHeader}>
            Source Record Field
          </Typography>

          <Typography varaint="h4" className={classes.childHeader}>
            {generateLabel}
          </Typography>
        </div>
        <div>
          {tableData.map(mapping => (
            <div className={classes.rowContainer} key={mapping.index}>
              <div className={classes.innerRow}>
                <div className={classes.childHeader}>
                  <DynaTypeableSelect
                    key={`extract-${editorId}-${initChangeIdentifier}-${mapping.rowIdentifier}`}
                    id={`fieldMappingExtract-${mapping.index}`}
                    labelName="name"
                    valueName="id"
                    value={mapping.extract || mapping.hardCodedValueTmp}
                    options={extractFields}
                    disabled={mapping.isNotEditable || disabled}
                    onBlur={(id, evt) => {
                      handleFieldUpdate(
                        mapping.index,
                        { target: { value: evt } },
                        'extract'
                      );
                    }}
                  />
                </div>
                <div className={classes.childHeader}>
                  <DynaTypeableSelect
                    key={`generate-${editorId}-${initChangeIdentifier}-${mapping.rowIdentifier}`}
                    id={`fieldMappingGenerate-${mapping.index}`}
                    value={mapping.generate}
                    labelName="name"
                    valueName="id"
                    options={generateFields}
                    disabled={mapping.isRequired || disabled}
                    onBlur={handleGenerateUpdate(mapping)}
                  />
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
    </div>
  );
}
