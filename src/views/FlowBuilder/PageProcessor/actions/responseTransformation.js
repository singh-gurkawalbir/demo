import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
  },
}));

function ResponseTransformationDialog(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { open, onClose, resource } = props;
  const resourceId = resource._id;
  const { sampleResponseData, responseTransform } = resource;
  const fieldMeta = {
    fieldMap: {
      sampleResponseData: {
        id: 'sampleResponseData',
        name: 'sampleResponseData',
        type: 'textarea',
        defaultValue: sampleResponseData,
      },
      responseTransform: {
        id: 'responseTransform',
        name: 'responseTransform',
        label: 'Response Transform',
        type: 'responsetransformeditor',
        defaultValue: responseTransform,
        refreshOptionsOnChangesTo: ['sampleResponseData'],
        resourceId,
      },
    },
    layout: {
      fields: ['sampleResponseData', 'responseTransform'],
    },
  };
  const optionsHandler = (fieldId, fields) => {
    if (fieldId === 'responseTransform') {
      const sampleResponseData = fields.find(
        field => field.id === 'sampleResponseData'
      );

      return {
        sampleResponseData: sampleResponseData && sampleResponseData.value,
      };
    }
  };

  const handleSubmit = formValues => {
    const { sampleResponseData, responseTransform } = formValues;
    const patchSet = [];

    if (sampleResponseData) {
      patchSet.push({
        op: 'replace',
        path: '/sampleResponseData',
        value: sampleResponseData,
      });
    }

    patchSet.push({
      op: 'replace',
      path: '/responseTransform',
      value: responseTransform,
    });
    // Save the resource
    dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('imports', resourceId, 'value'));
    onClose();
  };

  return (
    <Dialog open={open} PaperProps={{ className: classes.paper }}>
      <DialogTitle>Response Transform</DialogTitle>
      <DialogContent>
        <DynaForm fieldMeta={fieldMeta} optionsHandler={optionsHandler}>
          <Button data-test="cancelResponseTransform" onClick={onClose}>
            Cancel
          </Button>
          <DynaSubmit data-test="saveResponseTransform" onClick={handleSubmit}>
            Save
          </DynaSubmit>
        </DynaForm>
      </DialogContent>
    </Dialog>
  );
}

function ResponseTransformation(props) {
  const { open } = props;

  return (
    <Fragment>{open && <ResponseTransformationDialog {...props} />}</Fragment>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'responseTransformation',
  position: 'middle',
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: ResponseTransformation,
};
