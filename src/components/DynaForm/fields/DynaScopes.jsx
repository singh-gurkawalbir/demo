import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { FieldWrapper } from 'react-forms-processor/dist';
import ModalDialog from '../../ModalDialog';
import TransferList from '../../TransferListComponent';
import defaultScopes from '../../../forms/constants/scopes';

const convertScopesDataIntoListData = scopes => scopes.map(scope => scope.name);
const excludeSelectedScopes = (defaultScopes, selectedScopes) =>
  defaultScopes.filter(scope => !selectedScopes.includes(scope));
const TransferListModal = props => {
  const {
    leftListDefaults,
    rightListDefaults,
    handleClose,
    id,
    onFieldChange,
  } = props;
  const [left, setLeft] = useState(leftListDefaults);
  const [right, setRight] = useState(rightListDefaults);
  const transferListProps = { left, setLeft, right, setRight };

  return (
    <ModalDialog show handleClose={handleClose}>
      <Fragment>
        <span>Scopes Editor</span>
      </Fragment>
      <TransferList {...transferListProps} />
      <Fragment>
        <Button variant="contained" onClick={() => onFieldChange(id, right)}>
          Save
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onFieldChange(id, right);
            handleClose();
          }}>
          Save And Close
        </Button>
      </Fragment>
    </ModalDialog>
  );
};

function DynaScopesDialog(props) {
  const { label, assistantType, value, onFieldChange, id } = props;
  const [showScopesEditor, setShowScopesEditor] = useState(false);
  const defaultAssistantScopes = excludeSelectedScopes(
    convertScopesDataIntoListData(defaultScopes[assistantType]),
    value
  );

  return (
    <Fragment>
      {showScopesEditor && (
        <TransferListModal
          id={id}
          leftListDefaults={defaultAssistantScopes}
          rightListDefaults={value}
          showModal={showScopesEditor}
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
}

const FieldWrappedScopesDialog = props => (
  <FieldWrapper {...props}>
    <DynaScopesDialog />
  </FieldWrapper>
);

export default FieldWrappedScopesDialog;
