import { Fragment, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import EditIcon from '../../../icons/EditIcon';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../../../DynaForm';
import DynaText from '../DynaText';
import DynaSubmit from '../../DynaSubmit';
import * as selectors from '../../../../reducers';

function FirstLevelModal(props) {
  const {
    connectionId,
    onFieldChange,
    id,
    handleClose,
    options: selectedSObject,
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
    if (fieldId === 'relatedListText') {
      const { value: selectedValue } = fields.find(
        field => field.id === 'childRelationship'
      );
      const { childSObject: selectedChildSObject } =
        options.find(option => option.value === selectedValue) || {};

      return selectedChildSObject;
    }
  };

  const fieldMeta = {
    fieldMap: {
      childRelationship: {
        id: 'childRelationship',
        name: '/childRelationship',

        type: 'refreshableselect',
        filterKey: 'salesforce-sObjects-childReferenceTo',
        commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
        removeRefresh: true,
      },

      relatedListText: {
        connectionId,
        id: 'relatedListText',
        name: '/relatedListText',
        refreshOptionsOnChangesTo: ['childRelationship'],
        type: 'salesforcetreemodal',
        skipFirstLevelFields: true,
      },
    },
    layout: {
      fields: ['childRelationship', 'relatedListText'],
    },
  };

  return (
    <ModalDialog show handleClose={handleClose}>
      <Typography>Related Lists</Typography>

      <DynaForm optionsHandler={optionsHandler} fieldMeta={fieldMeta}>
        <DynaSubmit
          onClick={values => {
            onFieldChange(id, values['/relatedListText']);
          }}>
          Add Selected
        </DynaSubmit>
        <Button onClick={handleClose}>Cancel</Button>
      </DynaForm>
    </ModalDialog>
  );
}

export default function DynaRelatedFields(props) {
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
