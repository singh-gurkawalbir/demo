import Button from '@material-ui/core/Button';
import React, { useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';

import DynaText from '../DynaText';
import AddIcon from '../../../icons/AddIcon';
import RefreshableTreeComponent from '../DynaRefreshableSelect/RefreshableTreeComponent';
import ModalDialog from '../../../ModalDialog';
import ActionButton from '../../../ActionButton';
import ButtonGroup from '../../../ButtonGroup';


const useStyles = makeStyles(theme => ({
  refrencedFieldWrapper: {
    flexDirection: 'row !important',
  },
  dynatreeAddBtn: {
    minWidth: 'unset',
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),

  },
}));

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
      <div>Select referenced fields</div>
      <div>
        <RefreshableTreeComponent
          {...rest}
          setSelectedValues={setSelectedValues}
          selectedValues={selectedValues}
        />
      </div>

      <ButtonGroup>
        <Button
          data-test="addSelected"
          variant="outlined"
          color="primary"
          onClick={() => {
            onFieldChange(id, selectedValues);
            handleClose();
          }}>
          Add Selected
        </Button>
        <Button data-test="closeReferencedFieldsDialog" onClick={handleClose}>
          Cancel
        </Button>
      </ButtonGroup>
    </ModalDialog>
  );
};

export default function DynaTreeModal(props) {
  const classes = useStyles();
  const { id, onFieldChange, value, label, helpText, disabled, errorMsg, options } = props;
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
      <div className={classes.refrencedFieldWrapper}>
        <DynaText
          id={id}
          onFieldChange={onFieldChange}
          value={value}
          helpText={helpText}
          label={label}
          delimiter=","
          isValid={!errorMsgTextField}
          errorMessages={errorMsgTextField}
      />
        <ActionButton data-test="openReferencedFieldsDialog" onClick={toggle} className={classes.dynatreeAddBtn}>
          <AddIcon />
        </ActionButton>
      </div>
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
