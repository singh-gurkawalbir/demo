import Button from '@material-ui/core/Button';
import React, { useCallback, useState, useEffect } from 'react';
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
  const { id, onFieldChange, value, disabled, errorMsg, options } = props;
  const [secondLevelModalOpen, setSecondLevelModalOpen] = useState(false);
  const [errorMsgTextField, setErrorMsgTextField] = useState(null);

  useEffect(() => {
    if (!disabled) setErrorMsgTextField(null);
  }, [disabled]);
  const toggle = useCallback(() => {
    if (disabled) setErrorMsgTextField(errorMsg);
    else {
      setSecondLevelModalOpen(state => !state);
    }
  }, [disabled, errorMsg]);
  const { referenceTo, relationshipName } = options;

  return (
    <>
      <DynaText
        id={id}
        onFieldChange={onFieldChange}
        value={value}
        delimiter=","
        isValid={!errorMsgTextField}
        errorMessages={errorMsgTextField}
      />
      <IconTextButton data-test="openReferencedFieldsDialog" onClick={toggle}>
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
    </>
  );
}
