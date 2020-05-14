import ManageLookup from './index';
import ModalDialog from '../../ModalDialog';

export default function ManageLookupDialog(props) {
  const { id, onClose } = props;

  return (
    <ModalDialog show onClose={onClose} key={id}>
      <div>Add lookup</div>
      <div>
        <ManageLookup {...props} />
      </div>
    </ModalDialog>
  );
}
