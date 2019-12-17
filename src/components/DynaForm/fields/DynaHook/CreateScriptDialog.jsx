import Button from '@material-ui/core/Button';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import { getCreateScriptMetadata } from './utils';
import ModalDialog from '../../../ModalDialog';

export default function CreateScriptDialog(props) {
  const { onClose, scriptId } = props;
  const metadata = getCreateScriptMetadata(scriptId);
  const onCancel = () => onClose();
  const handleSubmit = values => onClose(true, values);

  return (
    <ModalDialog show onClose={onCancel}>
      <div>Create Script</div>
      <div>
        <DynaForm fieldMeta={metadata}>
          <DynaSubmit data-test="saveScript" onClick={handleSubmit}>
            Save
          </DynaSubmit>
          <Button data-test="cancelScript" onClick={onCancel}>
            Cancel
          </Button>
        </DynaForm>
      </div>
    </ModalDialog>
  );
}
