import { Fragment, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import EditIcon from '../../../icons/EditIcon';
import DynaText from '../DynaText';
import * as selectors from '../../../../reducers';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../DynaSubmit';
import IconTextButton from '../../../IconTextButton';
import { useCallMetadataAndReturnStatus } from './DynaRelatedList';
import Spinner from '../../../Spinner';

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
        label: 'Parent SObject Type:',
        type: 'refreshableselect',
        filterKey: 'salesforce-sObjects-referenceFields',
        commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
        removeRefresh: true,
      },

      referencedFields: {
        connectionId,
        id: 'referencedFields',
        name: '/referencedFields',
        refreshOptionsOnChangesTo: ['parentSObjectType'],
        type: 'salesforcetreemodal',
        disabledWhen: [{ field: 'parentSObjectType', is: [''] }],
        defaultValue: props.value,
      },
    },
    layout: {
      fields: ['parentSObjectType', 'referencedFields'],
    },
  };

  return (
    <ModalDialog show handleClose={handleClose}>
      <Typography>Referenced Fields</Typography>
      <DynaForm optionsHandler={optionsHandler} fieldMeta={fieldMeta}>
        <Button onClick={handleClose}>Cancel</Button>
        <DynaSubmit
          onClick={values => {
            onFieldChange(id, values['/referencedFields']);
            handleClose();
          }}>
          Save
        </DynaSubmit>
      </DynaForm>
    </ModalDialog>
  );
};

export default function DynaReferencedFields(props) {
  const [firstLevelModalOpen, setFirstLevelModalOpen] = useState(false);
  const toggle = useCallback(() => setFirstLevelModalOpen(state => !state), []);
  //   const [referencedFields, setReferencedFields] = useState('');
  const { disabled } = props;
  const { status } = useCallMetadataAndReturnStatus(props);

  return (
    <Fragment>
      {firstLevelModalOpen ? (
        <FirstLevelModal {...props} handleClose={toggle} />
      ) : null}
      <DynaText {...props} options={null} />
      {status === 'refreshed' ? (
        <Spinner />
      ) : (
        <IconTextButton onClick={toggle} disabled={disabled}>
          <EditIcon />
        </IconTextButton>
      )}
    </Fragment>
  );
}
