import Button from '@material-ui/core/Button';
import { Fragment, useCallback, useState } from 'react';
import DynaText from '../DynaText';
import AddIcon from '../../../icons/AddIcon';
import RefreshableTreeComponent from '../DynaRefreshableSelect/RefreshableTreeComponent';
import ModalDialog from '../../../ModalDialog';
import IconTextButton from '../../../IconTextButton';

function extractValues(value) {
  // Specific case in handling referencedFields
  if (value && value.length === 1 && typeof value[0] === 'string') {
    return value[0].split(',');
  }

  return value || [];
}

export const ReferencedFieldsModal = props => {
  const { handleClose, onFieldChange, id, value, ...rest } = props;
  const [selectedValues, setSelectedValues] = useState(extractValues(value));

  return (
    <ModalDialog show onClose={handleClose}>
      <div>Select Referenced Fields</div>
      <div>
        <RefreshableTreeComponent
          {...rest}
          setSelectedValues={setSelectedValues}
          selectedValues={selectedValues}
        />
      </div>

      <div>
        <Button data-test="closeReferencedFieldsDialog" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          data-test="addSelected"
          onClick={() => {
            onFieldChange(id, selectedValues);
            handleClose();
          }}>
          Add Selected
        </Button>
      </div>
    </ModalDialog>
  );
};

export default function DynaTreeModal(props) {
  const { id, onFieldChange, value, disabled, options } = props;
  const [secondLevelModalOpen, setSecondLevelModalOpen] = useState(false);
  const toggle = useCallback(
    () => setSecondLevelModalOpen(state => !state),
    []
  );
  const { referenceTo, relationshipName } = options;

  return (
    <Fragment>
      <DynaText
        id={id}
        onFieldChange={onFieldChange}
        value={value}
        delimiter=","
      />
      <IconTextButton
        data-test="openReferencedFieldsDialog"
        onClick={toggle}
        disabled={disabled}>
        <AddIcon />
      </IconTextButton>
      {secondLevelModalOpen ? (
        <ReferencedFieldsModal
          {...props}
          selectedReferenceTo={referenceTo}
          selectedRelationshipName={relationshipName}
          handleClose={toggle}
        />
      ) : null}
    </Fragment>
  );
}
