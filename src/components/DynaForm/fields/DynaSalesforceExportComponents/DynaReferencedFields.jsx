import React, { useState, useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import EditIcon from '../../../icons/EditIcon';
import DynaText from '../DynaText';
import { selectors } from '../../../../reducers';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import { useCallMetadataAndReturnStatus } from './DynaRelatedList';
import ActionButton from '../../../ActionButton';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { TextButton } from '../../../Buttons';

const useStyles = makeStyles(theme => ({
  refrencedFieldWrapper: {
    flexDirection: 'row !important',
    alignItems: 'flex-start',
    display: 'flex',
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

  const options = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`, 'salesforce-sObjects-referenceFields')?.data;

  const optionsHandler = (fieldId, fields) => {
    if (fieldId === 'referencedFields') {
      const { value: selectedValue } = fields.find(
        field => field.id === 'parentSObjectType'
      );
      const { referenceTo, relationshipName } =
        options?.find(option => option.value === selectedValue) || {};

      return { referenceTo, relationshipName };
    }
  };

  const fieldMeta = {
    fieldMap: {
      parentSObjectType: {
        id: 'parentSObjectType',
        name: '/parentSObjectType',
        label: 'Parent sObject type:',
        type: 'refreshableselect',
        helpKey: 'parentSObjectType',
        filterKey: 'salesforce-sObjects-referenceFields',
        commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
        isLoggable: true,
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
        isLoggable: true,
        defaultValue: props.value,
      },
    },
    layout: {
      fields: ['parentSObjectType', 'referencedFields'],
    },
  };
  const formKey = useFormInitWithPermissions({
    fieldMeta,
    optionsHandler,
  });

  return (
    <ModalDialog show onClose={handleClose}>
      <div>Referenced fields</div>

      <DynaForm formKey={formKey} />
      <DynaSubmit
        formKey={formKey}
        onClick={values => {
          onFieldChange(id, values['/referencedFields']);
          handleClose();
        }}>
        Save
      </DynaSubmit>
      <TextButton
        data-test="closeReferencedFields"
        onClick={handleClose}>
        Cancel
      </TextButton>
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
      {(status === 'refreshed' || status === 'requested') ? (
        <Spinner />
      ) : (
        <ActionButton
          data-test="editReferencedFields"
          onClick={toggle}
          disabled={disabled}
          placement="bottom"
          tooltip="Edit"
          className={classes.editIconRefrencedField}>
          <EditIcon />
        </ActionButton>
      )}
    </div>
  );
}
