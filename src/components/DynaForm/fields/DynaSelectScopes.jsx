import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import ModalDialog from '../../ModalDialog';
import TransferList from '../../TransferList';

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
    <ModalDialog show onClose={handleClose}>
      <Fragment>
        <span>Scopes Editor</span>
      </Fragment>
      <TransferList {...transferListProps} />
      <Fragment>
        <Button
          data-test="saveSelectedScopes"
          variant="contained"
          onClick={() => onFieldChange(id, selectedScopes)}>
          Save
        </Button>
        <Button
          data-test="saveAndCloseSelectedScopes"
          variant="contained"
          color="primary"
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

export default function DynaSelectScopesDialog(props) {
  const { label, scopes, value: selectedScopes, onFieldChange, id } = props;
  const [showScopesModal, setShowScopesModal] = useState(false);
  const defaultAvailableScopes = excludeSelectedScopes(scopes, selectedScopes);

  return (
    <Fragment>
      {showScopesModal && (
        <TransferListModal
          id={id}
          availableScopes={defaultAvailableScopes}
          selectedScopes={selectedScopes}
          onFieldChange={onFieldChange}
          handleClose={() => {
            setShowScopesModal(false);
          }}
        />
      )}
      <Button
        data-test={id}
        variant="contained"
        color="primary"
        onClick={() => setShowScopesModal(true)}>
        {label}
      </Button>
    </Fragment>
  );
}
