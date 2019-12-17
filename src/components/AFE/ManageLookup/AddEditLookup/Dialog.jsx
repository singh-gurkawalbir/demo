import AddEditLookup from './index';
import ModalDialog from '../../../ModalDialog';

export default function AddEditLookupDialog(props) {
  const { id, onClose } = props;

  return (
    <ModalDialog show onClose={onClose} key={id}>
      <div>Add Lookup</div>
      <div>
        <AddEditLookup {...props} />
      </div>
    </ModalDialog>
  );
}
