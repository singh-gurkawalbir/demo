import { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import EditIcon from '../../../icons/EditIcon';
import DynaText from '../DynaText';
import * as selectors from '../../../../reducers';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../DynaSubmit';
import { useCallMetadataAndReturnStatus } from './DynaRelatedList';
import Spinner from '../../../Spinner';
import ActionButton from '../../../ActionButton';

const useStyles = makeStyles({
  fieldWrapper: {
    flexDirection: `row !important`,
  },
  actionButton: {
    marginLeft: 5,
  },
});
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
    <ModalDialog show onClose={handleClose}>
      <div>Referenced Fields</div>

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
    <div className={classes.fieldWrapper}>
      {firstLevelModalOpen ? (
        <FirstLevelModal {...props} handleClose={toggle} />
      ) : null}
      <DynaText {...props} options={null} />
      {status === 'refreshed' ? (
        <Spinner />
      ) : (
        <ActionButton
          data-test="editReferencedFields"
          onClick={toggle}
          disabled={disabled}
          className={classes.actionButton}>
          <EditIcon />
        </ActionButton>
      )}
    </div>
  );
}
