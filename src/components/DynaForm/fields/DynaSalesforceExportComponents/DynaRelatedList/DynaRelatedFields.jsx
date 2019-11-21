import { Fragment, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import IconTextButton from '../../../../IconTextButton';
import EditIcon from '../../../../icons/EditIcon';
import ArrowLeftIcon from '../../../../icons/ArrowLeftIcon';
import ModalDialog from '../../../../ModalDialog';
import DynaForm from '../../..';
import DynaText from '../../DynaText';
import DynaSubmit from '../../../DynaSubmit';
import * as selectors from '../../../../../reducers';
import AddIcon from '../../../../icons/AddIcon';
import CeligoTable from '../../../../CeligoTable';
import metadata from './metadata';

const getRelationShipName = (options, parentField, childSObject) => {
  const { relationshipName } =
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
    onFieldChange,
    id,
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

  const { referencedFields, filter, orderBy, parentField, childSObject } =
    value[selectedElement] || {};
  const relationshipName = getRelationShipName(
    options,
    parentField,
    childSObject
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

          onFieldChange(
            id,
            selectedElement
              ? (value[selectedElement] = updatedValue)
              : (value && value.push(updatedValue)) || [value]
          );
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
    count,
  } = props;
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
        const { parentField, childSObject } = eachValue;
        const relationshipName = getRelationShipName(
          options,
          parentField,
          childSObject
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
  const { onFieldChange, id, value } = props;
  const [count, setCount] = useState(0);
  const handleDeleteItem = index => {
    // remount celigo table after delete
    const copyValue = [...value];

    delete copyValue[index];
    onFieldChange(id, copyValue);
    setCount(count => count + 1);
  };

  const handleEditItem = index => {
    setSelectedElement(index);
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
              count={count}
              handleClose={toggleListItemModelOpen}
              handleEditItem={handleEditItem}
              handleDeleteItem={handleDeleteItem}
            />
          </Fragment>
        ) : (
          <Fragment>
            <IconTextButton>
              <ArrowLeftIcon onClick={toggleListItemModelOpen} />
              Back to related list
            </IconTextButton>

            <EditListItemModal
              {...rest}
              selectedElement={selectedElement}
              handleClose={toggleListItemModelOpen}
            />
          </Fragment>
        )}
      </Fragment>
    </ModalDialog>
  );
}

export default function DynaRelatedFields(props) {
  const [firstLevelModalOpen, setFirstLevelModalOpen] = useState(false);
  const toggleFirstLevelModalOpen = useCallback(
    () => setFirstLevelModalOpen(state => !state),
    []
  );

  //   const [referencedFields, setReferencedFields] = useState('');

  return (
    <Fragment>
      {firstLevelModalOpen ? (
        <FirstLevelModal {...props} handleClose={toggleFirstLevelModalOpen} />
      ) : null}
      <DynaText {...props} options={null} />
      <EditIcon onClick={toggleFirstLevelModalOpen} />
    </Fragment>
  );
}
