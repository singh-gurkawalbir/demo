import { Dialog, DialogContent, DialogTitle, Button } from '@material-ui/core';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import { getCreateScriptMetadata } from './utils';

export default function CreateScriptDialog(props) {
  const { onClose, scriptId } = props;
  const metadata = getCreateScriptMetadata(scriptId);
  const onCancel = () => onClose();
  const handleSubmit = values => onClose(true, values);

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle>Create Script</DialogTitle>
      <DialogContent style={{ width: '30vw' }}>
        <DynaForm fieldMeta={metadata}>
          <Button data-test="cancelScript" onClick={onCancel}>
            Cancel
          </Button>
          <DynaSubmit data-test="saveScript" onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </DynaForm>
      </DialogContent>
    </Dialog>
  );
}
