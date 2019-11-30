import { Fragment, useCallback, useState, useEffect } from 'react';
import { deepClone } from 'fast-json-patch';
import { useSelector, useDispatch } from 'react-redux';
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
import actions from '../../../../../actions';
import Spinner from '../../../../Spinner';

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
        disabledWhen: [{ field: 'childRelationship', is: [''] }],
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
    <ModalDialog show onClose={handleClose}>
      <Typography>Related Lists</Typography>
      <Fragment>
        {!editListItemModelOpen ? (
          <Fragment>
            <IconTextButton
              data-test="addOrEditNewRelatedList"
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
          <Button data-test="closeRelatedListModal" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            data-test="saveRelatedList"
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
    height: theme.spacing(30),
  },
}));

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
    <Fragment>
      {firstLevelModalOpen ? (
        <FirstLevelModal {...props} handleClose={toggleFirstLevelModalOpen} />
      ) : null}
      <div className={classes.inlineEditorContainer}>
        <span>{props.label}</span>
        <CodeEditor
          {...props}
          mode="json"
          data-test={id || 'relatedListContent'}
          readOnly
        />
        {status === 'refreshed' ? (
          <Spinner />
        ) : (
          <IconTextButton
            data-test="editRelatedList"
            onClick={toggleFirstLevelModalOpen}
            disabled={disabled}>
            <EditIcon />
          </IconTextButton>
        )}
      </div>
    </Fragment>
  );
}
