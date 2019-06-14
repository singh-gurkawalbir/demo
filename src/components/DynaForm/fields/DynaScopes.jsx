import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { FieldWrapper } from 'react-forms-processor/dist';
import ModalDialog from '../../ModalDialog';
import TransferList from '../../TransferListComponent';

const excludeSelectedScopes = (defaultScopes, selectedScopes) =>
  defaultScopes.filter(scope => !selectedScopes.includes(scope));
const TransferListModal = props => {
  const {
    availableScopes: defaultAvailableScopes,
    selectedScopes: defaultSelectedScopes,
    handleClose,
    id,
    onFieldChange,
  } = props;
  const [availableScopes, setAvailableScopes] = useState(
    defaultAvailableScopes
  );
  const [selectedScopes, setSelectedScopes] = useState(defaultSelectedScopes);
  const transferListProps = {
    left: availableScopes,
    setLeft: setAvailableScopes,
    right: selectedScopes,
    setRight: setSelectedScopes,
  };

  return (
    <ModalDialog show handleClose={handleClose}>
      <Fragment>
        <span>Scopes Editor</span>
      </Fragment>
      <TransferList {...transferListProps} />
      <Fragment>
        <Button
          variant="contained"
          onClick={() => onFieldChange(id, selectedScopes)}>
          Save
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onFieldChange(id, selectedScopes);
            handleClose();
          }}>
          Save And Close
        </Button>
      </Fragment>
    </ModalDialog>
  );
};

const DynaScopesDialog = props => {
  const { label, allScopes, value, onFieldChange, id } = props;
  const [showScopesEditor, setShowScopesEditor] = useState(false);
  const defaultAvailableScopes = excludeSelectedScopes(allScopes, value);

  return (
    <Fragment>
      {showScopesEditor && (
        <TransferListModal
          id={id}
          availableScopes={defaultAvailableScopes}
          selectedScopes={value}
          onFieldChange={onFieldChange}
          handleClose={() => {
            setShowScopesEditor(false);
          }}
        />
      )}
      <Button
        variant="contained"
        // color="secondary"
        onClick={() => setShowScopesEditor(true)}>
        {label}
      </Button>
    </Fragment>
  );
};

const FieldWrappedScopesDialog = props => (
  <FieldWrapper {...props}>
    <DynaScopesDialog />
  </FieldWrapper>
);

export default FieldWrappedScopesDialog;
