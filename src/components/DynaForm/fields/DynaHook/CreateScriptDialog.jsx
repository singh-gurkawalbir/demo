import { Dialog, DialogContent, DialogTitle, Button } from '@material-ui/core';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import { getCreateScriptMetadata } from './utils';

export default function CreateScriptDialog(props) {
  const { onClose, scriptId } = props;
  const metadata = getCreateScriptMetadata(scriptId);

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle>Create Script</DialogTitle>
      <DialogContent style={{ width: '30vw' }}>
        <DynaForm fieldMeta={metadata}>
          <Button data-test="cancelScript" onClick={onClose}>
            Cancel
          </Button>
          <DynaSubmit data-test="saveScript" onClick={onClose}>
            Save
          </DynaSubmit>
        </DynaForm>
      </DialogContent>
    </Dialog>
  );
}
