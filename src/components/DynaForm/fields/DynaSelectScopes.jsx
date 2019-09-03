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
  const { label, scopes, value, onFieldChange, id } = props;
  const [showScopesModal, setShowScopesModal] = useState(false);
  const defaultAvailableScopes = excludeSelectedScopes(scopes, value);

  return (
    <Fragment>
      {showScopesModal && (
        <TransferListModal
          id={id}
          availableScopes={defaultAvailableScopes}
          selectedScopes={value}
          onFieldChange={onFieldChange}
          handleClose={() => {
            setShowScopesModal(false);
          }}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowScopesModal(true)}>
        {label}
      </Button>
    </Fragment>
  );
}
