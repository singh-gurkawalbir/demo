import Button from '@material-ui/core/Button';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import { getCreateScriptMetadata } from './utils';
import ModalDialog from '../../../ModalDialog';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';

export default function CreateScriptDialog({ onClose, scriptId }) {
  const { optionsHandler, ...rest } = getCreateScriptMetadata(scriptId);
  const handleSubmit = values => onClose(true, values);
  const formKey = useFormInitWithPermissions({
    fieldsMeta: rest,
    optionsHandler,
  });

  return (
    <ModalDialog show onClose={onClose}>
      <div>Create Script</div>
      <div>
        <DynaForm formKey={formKey} fieldMeta={rest} />
        <DynaSubmit
          formKey={formKey}
          data-test="saveScript"
          onClick={handleSubmit}>
          Save
        </DynaSubmit>
        <Button data-test="cancelScript" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </ModalDialog>
  );
}
