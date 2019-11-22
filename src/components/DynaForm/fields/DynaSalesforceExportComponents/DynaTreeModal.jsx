import { Typography, Button } from '@material-ui/core';
import { Fragment, useCallback, useState } from 'react';
import DynaText from '../DynaText';
import AddIcon from '../../../icons/AddIcon';
import RefreshableTreeComponent from '../DynaRefreshableSelect/RefreshableTreeComponent';
import ModalDialog from '../../../ModalDialog';

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

export default function DynaTreeModal(props) {
  const { id, onFieldChange, value, selectedParent, options } = props;
  const [secondLevelModalOpen, setSecondLevelModalOpen] = useState(false);
  const toggle = useCallback(
    () => setSecondLevelModalOpen(state => !state),
    []
  );
  const { referenceTo, relationshipName } = options;

  return (
    <Fragment>
      <DynaText id={id} onFieldChange={onFieldChange} value={value} />
      <AddIcon disabled={!!selectedParent} onClick={toggle} />
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
