import { Fragment, useCallback, useState, useEffect } from 'react';
import { deepClone } from 'fast-json-patch';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import IconTextButton from '../../../../IconTextButton';
import EditIcon from '../../../../icons/EditIcon';
import ArrowLeftIcon from '../../../../icons/ArrowLeftIcon';
import ModalDialog from '../../../../ModalDialog';
import DynaForm from '../../..';
import DynaSubmit from '../../../DynaSubmit';
import * as selectors from '../../../../../reducers';
import AddIcon from '../../../../icons/AddIcon';
import CeligoTable from '../../../../CeligoTable';
import metadata from './metadata';
import CodeEditor from '../../../../CodeEditor';

const getRelationShipName = (options, parentField, childSObject) => {
  const { label: relationshipName } =
    options.find(
      option =>
        option.field === parentField && option.childSObject === childSObject
    ) || {};

  return relationshipName;
};

const getParentFieldAndSObject = (options, relationshipName) => {
  const { childSObject: sObjectType, field: parentField } = options.find(
    option => option.value === relationshipName
  );

  return { sObjectType, parentField };
};

function EditListItemModal(props) {
  const {
    connectionId,
    setValue,
    value,
    handleClose,
    options: selectedSObject,
    selectedElement,
  } = props;
  const { data: options } = useSelector(state =>
    selectors.optionsFromMetadata({
      state,
      connectionId,
      commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
      filterKey: 'salesforce-sObjects-childReferenceTo',
    })
  );
  const optionsHandler = (fieldId, fields) => {
    if (fieldId === 'referencedFields') {
      const { value: selectedValue } = fields.find(
        field => field.id === 'childRelationship'
      );
      const { childSObject: selectedChildSObject } =
        options.find(option => option.value === selectedValue) || {};

      return selectedChildSObject;
    }
  };

  const { referencedFields, filter, orderBy, parentField, sObjectType } =
    value[selectedElement] || {};
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
        label: 'Child SObject Type',
        type: 'refreshableselect',
        filterKey: 'salesforce-sObjects-childReferenceTo',
        commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
        removeRefresh: true,
        defaultValue: relationshipName,
      },
      referencedFields: {
        connectionId,
        label: 'Referenced Fields',
        id: 'referencedFields',
        name: 'referencedFields',
        refreshOptionsOnChangesTo: ['childRelationship'],
        type: 'salesforcetreemodal',
        skipFirstLevelFields: true,
        defaultValue: referencedFields,
      },
      filterExpression: {
        label: 'Filter Expression',
        id: 'filter',
        name: 'filter',
        type: 'text',
        multiline: true,
        defaultValue: filter,
      },
      orderBy: {
        label: 'Order By',
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
        Add Selected
      </DynaSubmit>
      <Button onClick={handleClose}>Cancel</Button>
    </DynaForm>
  );
}

function RelatedListView(props) {
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
    <CeligoTable
      data={updatedValue}
      key={count}
      {...metadata}
      actionProps={{ handleDeleteItem, handleEditItem }}
    />
  );
}

function FirstLevelModal(props) {
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
    <ModalDialog show handleClose={handleClose}>
      <Typography>Related Lists</Typography>
      <Fragment>
        {!editListItemModelOpen ? (
          <Fragment>
            <IconTextButton
              onClick={() => {
                toggleListItemModelOpen();
                setSelectedElement(null);
              }}>
              <AddIcon />
              Add new Related List
            </IconTextButton>

            <RelatedListView
              {...rest}
              value={value}
              handleClose={toggleListItemModelOpen}
              handleEditItem={handleEditItem}
              handleDeleteItem={handleDeleteItem}
            />
          </Fragment>
        ) : (
          <Fragment>
            <IconTextButton>
              <ArrowLeftIcon
                onClick={() => {
                  toggleListItemModelOpen();
                }}
              />
              Back to related list
            </IconTextButton>

            <EditListItemModal
              {...rest}
              value={value}
              setValue={setValue}
              selectedElement={selectedElement}
              handleClose={toggleListItemModelOpen}
            />
          </Fragment>
        )}
      </Fragment>
      {!editListItemModelOpen && (
        <Fragment>
          <Button onClick={handleClose}> Cancel</Button>
          <Button
            onClick={() => {
              onFieldChange(id, value);
              handleClose();
            }}>
            Save
          </Button>
        </Fragment>
      )}
    </ModalDialog>
  );
}

const useStyles = makeStyles(theme => ({
  inlineEditorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    height: theme.spacing(10),
  },
}));

export default function DynaRelatedFields(props) {
  const [firstLevelModalOpen, setFirstLevelModalOpen] = useState(false);
  const toggleFirstLevelModalOpen = useCallback(
    () => setFirstLevelModalOpen(state => !state),
    []
  );
  //   const [referencedFields, setReferencedFields] = useState('');
  const classes = useStyles();
  const { disabled } = props;

  return (
    <Fragment>
      {firstLevelModalOpen ? (
        <FirstLevelModal {...props} handleClose={toggleFirstLevelModalOpen} />
      ) : null}
      <div className={classes.inlineEditorContainer}>
        <CodeEditor {...props} mode="json" readOnly />
        <IconTextButton onClick={toggleFirstLevelModalOpen} disabled={disabled}>
          <EditIcon />
        </IconTextButton>
      </div>
    </Fragment>
  );
}
