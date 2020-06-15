import React, { useCallback, useState, useEffect } from 'react';
import { deepClone } from 'fast-json-patch';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconTextButton from '../../../../IconTextButton';
import EditIcon from '../../../../icons/EditIcon';
import ArrowLeftIcon from '../../../../icons/ArrowLeftIcon';
import ModalDialog from '../../../../ModalDialog';
import FieldHelp from '../../../FieldHelp';
import DynaForm from '../../..';
import DynaSubmit from '../../../DynaSubmit';
import * as selectors from '../../../../../reducers';
import AddIcon from '../../../../icons/AddIcon';
import CeligoTable from '../../../../CeligoTable';
import metadata from './metadata';
import CodeEditor from '../../../../CodeEditor';
import actions from '../../../../../actions';
import Spinner from '../../../../Spinner';
import ActionButton from '../../../../ActionButton';
import ButtonGroup from '../../../../ButtonGroup';

const useStyles = makeStyles(theme => ({
  inlineEditorContainer: {
    marginRight: theme.spacing(1),
    height: theme.spacing(30),
    overflow: 'hidden',
    width: '100%',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  wrapperEditorContainer: {
    display: 'flex',
    // flexDirection: 'row !important',
  },
  dynaRelatedListCodeEditor: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  dynaRelatedListLabelWrapper: {
    display: 'flex',
  },
  label: {
    margin: 5,
    display: 'flex',
  },
  relatedListBtn: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  dynaRelatedListTable: {
    background: 'black',
  },
}));

const getRelationShipName = (options, parentField, childSObject) => {
  const { label: relationshipName } =
    options.find(
      option =>
        option.field === parentField && option.childSObject === childSObject
    ) || {};

  return relationshipName;
};

const getParentFieldAndSObject = (options, relationshipName) => {
  const { childSObject: sObjectType, field: parentField } =
    options.find(option => option.value === relationshipName) || {};

  return { sObjectType, parentField };
};

const defaultValueOptions = [];

function EditListItemModal(props) {
  const {
    connectionId,
    setValue,
    value,
    handleClose,
    options: selectedSObject,
    selectedElement,
  } = props;
  const options = useSelector(state => {
    const { data } = selectors.optionsFromMetadata({
      state,
      connectionId,
      commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
      filterKey: 'salesforce-sObjects-childReferenceTo',
    });

    return data || defaultValueOptions;
  });
  const optionsHandler = (fieldId, fields) => {
    if (fieldId === 'referencedFields') {
      const { value: selectedValue } = fields.find(
        field => field.id === 'childRelationship'
      );
      const { childSObject: referenceTo } =
        options.find(option => option.value === selectedValue) || {};

      return { referenceTo, relationshipName: '' };
    }
  };

  const { referencedFields, filter, orderBy, parentField, sObjectType } =
    (value && value[selectedElement]) || {};
  const relationshipName = getRelationShipName(
    options,
    parentField,
    sObjectType
  );
  const fieldMeta = {
    fieldMap: {
      childRelationship: {
        id: 'childRelationship',
        name: 'childRelationship',
        // Todo (Surya) 15533: helptext is needed
        helpText: 'helpText is useful to provide details to the user about the field',
        label: 'Child SObject Type',
        type: 'refreshableselect',
        filterKey: 'salesforce-sObjects-childReferenceTo',
        commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
        removeRefresh: true,
        defaultValue: relationshipName,
      },
      referencedFields: {
        connectionId,
        label: 'Referenced fields',
        // Todo (Surya) 15533: helptext is needed
        helpText: 'helpText is useful to provide details to the user about the field',
        id: 'referencedFields',
        name: 'referencedFields',
        refreshOptionsOnChangesTo: ['childRelationship'],
        type: 'salesforcetreemodal',
        skipFirstLevelFields: true,
        errorMsg: 'Please select a parent sObject Type',
        defaultValue: referencedFields,
        disabledWhen: [{ field: 'childRelationship', is: [''] }],
      },
      filterExpression: {
        label: 'Filter expression',
        id: 'filter',
        // Todo (Surya) 15533: helptext is needed
        helpText: 'helpText is useful to provide details to the user about the field',
        name: 'filter',
        type: 'text',
        multiline: true,
        defaultValue: filter,
      },
      orderBy: {
        label: 'Order by',
        // Todo (Surya) 15533: helptext is needed
        helpText: 'helpText is useful to provide details to the user about the field',
        id: 'orderBy',
        name: 'orderBy',
        type: 'refreshableselect',
        filterKey: 'salesforce-sObjects-nonReferenceFields',
        commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
        removeRefresh: true,
        defaultValue: orderBy,
      },
    },
    layout: {
      fields: [
        'childRelationship',
        'referencedFields',
        'filterExpression',
        'orderBy',
      ],
    },
  };

  return (
    <DynaForm optionsHandler={optionsHandler} fieldMeta={fieldMeta}>
      <DynaSubmit
        onClick={values => {
          const { childRelationship, ...rest } = values;
          const updatedValue = {
            ...getParentFieldAndSObject(options, childRelationship),
            ...rest,
          };

          setValue(
            selectedElement !== null
              ? (value[selectedElement] = updatedValue) && value
              : (value && [...value, updatedValue]) || [updatedValue]
          );
          handleClose();
        }}>
        Add selected
      </DynaSubmit>
      <Button variant="text" color="primary" onClick={handleClose}>Cancel</Button>
    </DynaForm>
  );
}

function RelatedListView(props) {
  const classes = useStyles();
  const {
    value,
    options: selectedSObject,
    connectionId,
    handleDeleteItem,
    handleEditItem,
  } = props;
  const [count, setCount] = useState(0);
  const length = value && value.length;

  useEffect(() => {
    if (length) setCount(count => count + 1);
  }, [length]);
  const { data: options } = useSelector(state =>
    selectors.optionsFromMetadata({
      state,
      connectionId,
      commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
      filterKey: 'salesforce-sObjects-childReferenceTo',
    })
  );
  const updatedValue = value
    ? value.map((eachValue, index) => {
      const { parentField, sObjectType } = eachValue;
      const relationshipName = getRelationShipName(
        options,
        parentField,
        sObjectType
      );

      return { index, relationshipName, ...eachValue };
    })
    : [];

  return (
    <div className={classes.dynaRelatedListTable}>
      <CeligoTable
        data={updatedValue}
        key={count}
        {...metadata}
        actionProps={{ handleDeleteItem, handleEditItem }}
    />
    </div>
  );
}

function FirstLevelModal(props) {
  const classes = useStyles();
  const { handleClose, ...rest } = props;
  const [editListItemModelOpen, setEditListItemModelOpen] = useState(false);
  const toggleListItemModelOpen = useCallback(
    () => setEditListItemModelOpen(state => !state),
    []
  );
  const [selectedElement, setSelectedElement] = useState(null);
  const { onFieldChange, id, value: actualValue } = props;
  const [value, setValue] = useState(deepClone(actualValue));
  const handleDeleteItem = index => {
    // remount celigo table after delete

    setValue(value => value.filter((val, ind) => ind !== index));
  };

  const handleEditItem = index => {
    setSelectedElement(index);
    toggleListItemModelOpen();
  };

  return (
    <ModalDialog show onClose={handleClose} maxWidth="lg">
      <div>Related lists</div>
      <div>
        {!editListItemModelOpen ? (
          <>
            <IconTextButton
              variant="outlined"
              color="secondary"
              className={classes.relatedListBtn}
              data-test="addOrEditNewRelatedList"
              onClick={() => {
                toggleListItemModelOpen();
                setSelectedElement(null);
              }}>
              <AddIcon />
              Add new related list
            </IconTextButton>

            <RelatedListView
              {...rest}
              value={value}
              handleClose={toggleListItemModelOpen}
              handleEditItem={handleEditItem}
              handleDeleteItem={handleDeleteItem}
            />
          </>
        ) : (
          <>
            <IconTextButton
              variant="outlined"
              color="secondary"
              className={classes.relatedListBtn}
              onClick={() => {
                toggleListItemModelOpen();
              }} >
              <ArrowLeftIcon /> Back to related list

            </IconTextButton>

            <EditListItemModal
              {...rest}
              value={value}
              setValue={setValue}
              selectedElement={selectedElement}
              handleClose={toggleListItemModelOpen}
            />
          </>
        )}
      </div>
      {!editListItemModelOpen && (
        <ButtonGroup>
          <Button
            data-test="saveRelatedList"
            variant="outlined"
            color="primary"
            onClick={() => {
              onFieldChange(id, value);
              handleClose();
            }}>
            Save
          </Button>
          <Button
            data-test="closeRelatedListModal"
            onClick={handleClose}
            variant="text"
            color="primary">
            Cancel
          </Button>
        </ButtonGroup>
      )}
    </ModalDialog>
  );
}


export function useCallMetadataAndReturnStatus(props) {
  const { options: selectedSObject, connectionId } = props;
  const dispatch = useDispatch();
  const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`;
  const { options, status } = useSelector(state => {
    const { data, status } = selectors.optionsFromMetadata({
      state,
      connectionId,
      commMetaPath,
      filterKey: 'salesforce-sObjects-childReferenceTo',
    });

    return { options: data || defaultValueOptions, status };
  });

  useEffect(() => {
    if (!status && selectedSObject && typeof selectedSObject === 'string') {
      dispatch(actions.metadata.request(connectionId, commMetaPath));
    }
  }, [commMetaPath, connectionId, dispatch, selectedSObject, status]);

  return { status, options };
}

export default function DynaRelatedList(props) {
  const [firstLevelModalOpen, setFirstLevelModalOpen] = useState(false);
  const toggleFirstLevelModalOpen = useCallback(
    () => setFirstLevelModalOpen(state => !state),
    []
  );
  const classes = useStyles();
  const { disabled, id } = props;
  const { status } = useCallMetadataAndReturnStatus(props);

  return (
    <>
      {firstLevelModalOpen ? (
        <FirstLevelModal {...props} handleClose={toggleFirstLevelModalOpen} />
      ) : null}
      <div >
        <div className={classes.dynaRelatedListLabelWrapper}>
          <span className={classes.label}>{props.label}</span>
          <FieldHelp {...props} />
        </div>
        <div className={classes.wrapperEditorContainer}>
          <div className={classes.inlineEditorContainer}>
            <CodeEditor
              {...props}
              className={classes.dynaRelatedListCodeEditor}
              mode="json"
              data-test={id || 'relatedListContent'}
              readOnly
          />
          </div>
          <div>
            {status === 'refreshed' ? (
              <Spinner size={24} />
            ) : (
              <>
                <ActionButton
                  data-test="editRelatedList"
                  onClick={toggleFirstLevelModalOpen}
                  disabled={disabled}>
                  <EditIcon />
                </ActionButton>

              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
