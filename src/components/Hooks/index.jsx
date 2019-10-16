import { Button } from '@material-ui/core';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import LoadResources from '../../components/LoadResources';
import Spinner from '../Spinner';

export default function Hooks(props) {
  const {
    onSave,
    onCancel,
    preHookData,
    preHookDataStatus,
    defaultValue = {},
  } = props;
  const [enquesnackbar] = useEnqueueSnackbar();

  // Shows loading icon till it gets sample data
  if (!preHookDataStatus || preHookDataStatus === 'requested') {
    return <Spinner />;
  }

  const defaultHookType =
    defaultValue && defaultValue._stackId ? 'stack' : 'script';
  const fieldMeta = {
    fieldMap: {
      hookType: {
        id: 'hookType',
        name: 'hookType',
        type: 'radiogroup',
        label: 'Hook Type',
        defaultValue: defaultHookType,
        showOptionsHorizontally: true,
        fullWidth: true,
        options: [
          {
            items: [
              { label: 'Script', value: 'script' },
              { label: 'Stack', value: 'stack' },
            ],
          },
        ],
      },
      script: {
        id: 'script',
        name: 'script',
        type: 'hook',
        hookType: 'script',
        preHookData,
        defaultValue: defaultHookType === 'script' ? defaultValue : {},
        visibleWhen: [{ field: 'hookType', is: ['script'] }],
      },
      stack: {
        id: 'stack',
        name: 'stack',
        type: 'hook',
        hookType: 'stack',
        defaultValue: defaultHookType === 'stack' ? defaultValue : {},
        visibleWhen: [{ field: 'hookType', is: ['stack'] }],
      },
    },
    layout: {
      fields: ['hookType', 'script', 'stack'],
    },
  };
  const handleSubmit = values => {
    const selectedHook = {};

    if (values.hookType === 'script') {
      selectedHook.function = values.script && values.script.function;
      selectedHook._scriptId = values.script && values.script._scriptId;
    } else {
      selectedHook.function = values.stack && values.stack.function;
      selectedHook._stackId = values.stack && values.stack._stackId;
    }

    if (
      selectedHook.function &&
      (selectedHook._scriptId || selectedHook._stackId)
    ) {
      onSave(selectedHook);
    } else {
      enquesnackbar({
        message: 'Please fill the mandatory fields',
        variant: 'error',
      });
    }
  };

  return (
    <LoadResources resources="scripts, stacks">
      <div>
        <DynaForm fieldMeta={fieldMeta}>
          <Button data-test="cancelLookupForm" onClick={onCancel}>
            Cancel
          </Button>
          <DynaSubmit data-test="saveLookupForm" onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </DynaForm>
      </div>
    </LoadResources>
  );
}
