// import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { RightDrawer } from '../RightDrawer';
import TitleBar from '../TitleBar';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';

// const useStyles = makeStyles(() => ({}));

export default function WizardDrawer({ flowId, match, history, ...props }) {
  const handleSubmit = () => history.goBack();
  // const classes = useStyles();
  const open = !flowId;
  const optionsHandler = undefined;
  const fieldMeta = {
    fieldMap: {
      application: {
        id: 'application',
        name: 'application',
        label: 'Select source Application(s)',
        type: 'selectapplication',
        placeholder: 'search...',
        defaultValue: '',
        required: true,
        // visibleWhen: [visibleWhenIsNew],
      },
    },
    layout: {
      fields: ['application'],
    },
  };

  return (
    <RightDrawer {...props} open={open}>
      <TitleBar
        history={history}
        title="Flow wizard"
        submitLabel="Create Flow"
        onSubmit={handleSubmit}
      />
      <DynaForm fieldMeta={fieldMeta} optionsHandler={optionsHandler}>
        <Button data-test="cancelFbWizard" onClick={() => history.goBack()}>
          Cancel
        </Button>
        <DynaSubmit data-test="submitFbWizard" onClick={handleSubmit}>
          Save
        </DynaSubmit>
      </DynaForm>
    </RightDrawer>
  );
}
