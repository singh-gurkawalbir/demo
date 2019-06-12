import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { FieldWrapper } from 'react-forms-processor/dist';
import ModalDialog from '../../../../views/MyAccount/ModalDialog';
import TransferList from '../../../TransferListComponent';
import defaultScopes from '../../../../forms/constants/scopes';

function ButtonWithHandle(props) {
  const { onClick, label } = props;

  return (
    <Button
      variant="contained"
      // color="secondary"
      onClick={onClick}>
      {label}
    </Button>
  );
}

function DynaScopesDialog(props) {
  const { label, assistantType, value } = props;
  const [showScopesEditor, setShowScopesEditor] = useState(false);
  const defaultAssistantScopes = defaultScopes[assistantType];

  return (
    <Fragment>
      <ModalDialog
        show={showScopesEditor}
        handleClose={() => {
          setShowScopesEditor(false);
        }}>
        <Fragment>
          <span>Scopes Editor</span>
        </Fragment>
        <TransferList
          leftDefault={defaultAssistantScopes}
          rightDefault={value}
        />
        <Fragment>
          <ButtonWithHandle label="Save" />
          <ButtonWithHandle label="Save And Close" />
        </Fragment>
      </ModalDialog>

      <ButtonWithHandle
        label={label}
        onClick={() => {
          console.log('clicked');
          setShowScopesEditor(true);
        }}
      />
    </Fragment>
  );
}

const FieldWrappedScopesDialog = props => (
  <FieldWrapper {...props}>
    <DynaScopesDialog />
  </FieldWrapper>
);

export default FieldWrappedScopesDialog;
