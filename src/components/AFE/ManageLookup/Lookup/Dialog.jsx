import Lookup from './index';
import ModalDialog from '../../../ModalDialog';

export default function LookupDialog(props) {
  const { id, onClose } = props;

  return (
    <ModalDialog show onClose={onClose} key={id}>
      <div>Add Lookup</div>
      <div>
        <Lookup {...props} />
      </div>
    </ModalDialog>
  );
}
