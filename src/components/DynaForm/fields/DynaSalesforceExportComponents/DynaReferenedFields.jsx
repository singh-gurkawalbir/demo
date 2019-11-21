import { Fragment, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import EditIcon from '../../../icons/EditIcon';
import DynaText from '../DynaText';
import * as selectors from '../../../../reducers';
import ModalDialog from '../../../ModalDialog';
import RefreshableTreeComponent from '../DynaRefreshableSelect/RefreshableTreeComponent';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../DynaSubmit';

export const ReferencedFieldsModal = props => {
  const { handleClose, onFieldChange, id, value, ...rest } = props;
  const [selectedValues, setSelectedValues] = useState(
    value ? value.split(',') : []
  );

  return (
    <ModalDialog show handleClose={handleClose}>
      <Typography>Select Referenced Fields</Typography>
      <RefreshableTreeComponent
        {...rest}
        setSelectedValues={setSelectedValues}
        selectedValues={selectedValues}
      />
      <Fragment>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            onFieldChange(id, selectedValues.join(','));
            handleClose();
          }}>
          Add Selected
        </Button>
      </Fragment>
    </ModalDialog>
  );
};

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
      const { referenceTo: selectedReferenceTo } =
        options.find(option => option.value === selectedValue) || {};

      return selectedReferenceTo;
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

export default function DynaRequiredTrigger(props) {
  const [firstLevelModalOpen, setFirstLevelModalOpen] = useState(false);
  const toggle = useCallback(() => setFirstLevelModalOpen(state => !state), []);

  //   const [referencedFields, setReferencedFields] = useState('');

  return (
    <Fragment>
      {firstLevelModalOpen ? (
        <FirstLevelModal {...props} handleClose={toggle} />
      ) : null}
      <DynaText {...props} options={null} />
      <EditIcon onClick={toggle} />
    </Fragment>
  );
}
