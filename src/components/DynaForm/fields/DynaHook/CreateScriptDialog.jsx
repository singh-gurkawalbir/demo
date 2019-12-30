import Button from '@material-ui/core/Button';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import { getCreateScriptMetadata } from './utils';
import ModalDialog from '../../../ModalDialog';

export default function CreateScriptDialog({ onClose, scriptId }) {
  const { optionsHandler, ...rest } = getCreateScriptMetadata(scriptId);
  const handleSubmit = values => onClose(true, values);

  return (
    <ModalDialog show onClose={onClose}>
      <div>Create Script</div>
      <div>
        <DynaForm fieldMeta={rest} optionsHandler={optionsHandler}>
          <DynaSubmit data-test="saveScript" onClick={handleSubmit}>
            Save
          </DynaSubmit>
          <Button data-test="cancelScript" onClick={onClose}>
            Cancel
          </Button>
        </DynaForm>
      </div>
    </ModalDialog>
  );
}
