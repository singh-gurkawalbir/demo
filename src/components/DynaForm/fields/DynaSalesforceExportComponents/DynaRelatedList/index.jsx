import React, { useCallback, useState, useEffect } from 'react';
import { deepClone } from 'fast-json-patch';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner, FilledButton, TextButton } from '@celigo/fuse-ui';
import EditIcon from '../../../../icons/EditIcon';
import ArrowLeftIcon from '../../../../icons/ArrowLeftIcon';
import ModalDialog from '../../../../ModalDialog';
import FieldHelp from '../../../FieldHelp';
import DynaForm from '../../..';
import DynaSubmit from '../../../DynaSubmit';
import { selectors } from '../../../../../reducers';
import AddIcon from '../../../../icons/AddIcon';
import CeligoTable from '../../../../CeligoTable';
import metadata from './metadata';
import CodeEditor from '../../../../CodeEditor';
import actions from '../../../../../actions';
import ActionButton from '../../../../ActionButton';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import ActionGroup from '../../../../ActionGroup';
import customCloneDeep from '../../../../../utils/customCloneDeep';

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

  const options = useSelectorMemo(selectors.makeOptionsFromMetadata,
    connectionId,
    `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
    'salesforce-sObjects-childReferenceTo',
  )?.data || defaultValueOptions;

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
        helpKey: 'childRelationship',
        label: 'Child sObject Type',
        type: 'refreshableselect',
        filterKey: 'salesforce-sObjects-childReferenceTo',
        commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
        removeRefresh: true,
        defaultValue: relationshipName,
        isLoggable: true,
      },
      referencedFields: {
        connectionId,
        label: 'Referenced fields',
        helpKey: 'salesforce.referencedFields',
        id: 'referencedFields',
        name: 'referencedFields',
        refreshOptionsOnChangesTo: ['childRelationship'],
        type: 'salesforcetreemodal',
        skipFirstLevelFields: true,
        errorMsg: 'Please select a parent sObject Type',
        defaultValue: referencedFields,
        disabledWhen: [{ field: 'childRelationship', is: [''] }],
        // verify if isLoggable
        isLoggable: true,
      },
      filterExpression: {
        label: 'Filter expression',
        id: 'filter',
        helpKey: 'filterExpression',
        name: 'filter',
        type: 'text',
        multiline: true,
        defaultValue: filter,
        isLoggable: true,
      },
      orderBy: {
        label: 'Order by',
        helpKey: 'orderBy',
        id: 'orderBy',
        name: 'orderBy',
        type: 'salesforcesortorderselect',
        filterKey: 'salesforce-sObjects-nonReferenceFields',
        commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
        removeRefresh: true,
        defaultValue: orderBy,
        isLoggable: true,
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
  const formKey = useFormInitWithPermissions({
    fieldMeta,
    optionsHandler,
  });

  return (
    <>
      <DynaForm formKey={formKey} />

      <DynaSubmit
        formKey={formKey}
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
      <TextButton onClick={handleClose}>Cancel</TextButton>
    </>
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

  const options = useSelectorMemo(selectors.makeOptionsFromMetadata,
    connectionId,
    `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
    'salesforce-sObjects-childReferenceTo')?.data;
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
        data={customCloneDeep(updatedValue)}
        key={count}
        {...metadata}
        actionProps={{ handleDeleteItem, handleEditItem }}
    />
    </div>
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
    <ModalDialog show onClose={handleClose} maxWidth="lg">
      <div>Related lists</div>
      <div>
        {!editListItemModelOpen ? (
          <>
            <TextButton
              sx={{ mb: 2, mt: 1 }}
              data-test="addOrEditNewRelatedList"
              startIcon={<AddIcon />}
              onClick={() => {
                toggleListItemModelOpen();
                setSelectedElement(null);
              }}>

              Add new related list
            </TextButton>

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
            <TextButton
              startIcon={<ArrowLeftIcon />}
              sx={{ mb: 2, mt: 1 }}
              onClick={() => {
                toggleListItemModelOpen();
              }} >
              Back to related list

            </TextButton>

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
        <ActionGroup>
          <FilledButton
            data-test="saveRelatedList"
            onClick={() => {
              onFieldChange(id, value);
              handleClose();
            }}>
            Save
          </FilledButton>
          <TextButton
            data-test="closeRelatedListModal"
            onClick={handleClose}>
            Cancel
          </TextButton>
        </ActionGroup>
      )}
    </ModalDialog>
  );
}

export function useCallMetadataAndReturnStatus(props) {
  const { options: selectedSObject, connectionId } = props;
  const dispatch = useDispatch();
  const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`;

  const {data, status} = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath, 'salesforce-sObjects-childReferenceTo');

  const options = data || defaultValueOptions;

  useEffect(() => {
    if (!status && selectedSObject && typeof selectedSObject === 'string') {
      dispatch(actions.metadata.request(connectionId, commMetaPath, {refreshCache: true}));
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
            {(status === 'refreshed' || status === 'requested') ? (
              <Spinner />
            ) : (
              <>
                <ActionButton
                  data-test="editRelatedList"
                  onClick={toggleFirstLevelModalOpen}
                  tooltip="Edit"
                  placement="bottom"
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
