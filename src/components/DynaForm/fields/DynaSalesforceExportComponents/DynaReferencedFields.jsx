import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import EditIcon from '../../../icons/EditIcon';
import DynaText from '../DynaText';
import * as selectors from '../../../../reducers';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import { useCallMetadataAndReturnStatus } from './DynaRelatedList';
import Spinner from '../../../Spinner';
import ActionButton from '../../../ActionButton';

const useStyles = makeStyles(theme => ({
  refrencedFieldWrapper: {
    flexDirection: 'row !important',
    alignItems: 'flex-start',
  },
  editIconRefrencedField: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
  refrencedFieldDynaText: {
    marginBottom: 0,
  },
}));
const FirstLevelModal = props => {
  const {
    options: selectedSObject,
    connectionId,
    handleClose,
    onFieldChange,
    id,
  } = props;
  const { data: options } = useSelector(state =>
    selectors.optionsFromMetadata({
      state,
      connectionId,
      commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
      filterKey: 'salesforce-sObjects-referenceFields',
    })
  );
  const optionsHandler = (fieldId, fields) => {
    if (fieldId === 'referencedFields') {
      const { value: selectedValue } = fields.find(
        field => field.id === 'parentSObjectType'
      );
      const { referenceTo, relationshipName } =
        options.find(option => option.value === selectedValue) || {};

      return { referenceTo, relationshipName };
    }
  };

  const fieldMeta = {
    fieldMap: {
      parentSObjectType: {
        id: 'parentSObjectType',
        name: '/parentSObjectType',
        label: 'Parent SObject type:',
        type: 'refreshableselect',
        helpKey: 'parentSObjectType',
        filterKey: 'salesforce-sObjects-referenceFields',
        commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
        removeRefresh: true,
      },
      referencedFields: {
        connectionId,
        id: 'referencedFields',
        helpKey: 'referencedFields',
        label: 'Referenced fields:',
        name: '/referencedFields',
        refreshOptionsOnChangesTo: ['parentSObjectType'],
        type: 'salesforcetreemodal',
        errorMsg: 'Please select a parent sObject Type',
        disabledWhen: [{ field: 'parentSObjectType', is: [''] }],
        defaultValue: props.value,
      },
    },
    layout: {
      fields: ['parentSObjectType', 'referencedFields'],
    },
  };

  return (
    <ModalDialog show onClose={handleClose}>
      <div>Referenced fields</div>

      <DynaForm optionsHandler={optionsHandler} fieldMeta={fieldMeta}>
        <DynaSubmit
          onClick={values => {
            onFieldChange(id, values['/referencedFields']);
            handleClose();
          }}>
          Save
        </DynaSubmit>
        <Button
          data-test="closeReferencedFields"
          onClick={handleClose}
          variant="text"
          color="primary">
          Cancel
        </Button>
      </DynaForm>
    </ModalDialog>
  );
};

export default function DynaReferencedFields(props) {
  const classes = useStyles();
  const [firstLevelModalOpen, setFirstLevelModalOpen] = useState(false);
  const toggle = useCallback(() => setFirstLevelModalOpen(state => !state), []);
  //   const [referencedFields, setReferencedFields] = useState('');
  const { disabled } = props;
  const { status } = useCallMetadataAndReturnStatus(props);

  return (
    <div className={classes.refrencedFieldWrapper}>
      {firstLevelModalOpen ? (
        <FirstLevelModal {...props} handleClose={toggle} />
      ) : null}
      <DynaText
        {...props}
        options={null}
        className={classes.refrencedFieldDynaText}
      />
      {status === 'refreshed' ? (
        <Spinner size={24} />
      ) : (
        <ActionButton
          data-test="editReferencedFields"
          onClick={toggle}
          disabled={disabled}
          className={classes.editIconRefrencedField}>
          <EditIcon />
        </ActionButton>
      )}
    </div>
  );
}
