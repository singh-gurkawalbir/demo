import { Component } from 'react';
import { withStyles, Typography } from '@material-ui/core';
import ReactDiffViewer from 'react-diff-viewer';
import { RESOURCE_TYPE_SINGULAR_TO_LABEL } from '../../constants/resource';
import ModalDialog from '../ModalDialog';

@withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))
export default class DiffDialog extends Component {
  render() {
    const { auditLog, onCancelClick } = this.props;

    return (
      <ModalDialog show maxWidth={false} onClose={onCancelClick}>
        <div>
          {`${
            RESOURCE_TYPE_SINGULAR_TO_LABEL[auditLog.resourceType]
          } Audit Log`}
          <Typography>{`Field: ${auditLog.fieldChange.fieldPath}`}</Typography>
        </div>

        <div>
          <ReactDiffViewer
            hideLineNumbers
            oldValue={JSON.stringify(auditLog.fieldChange.oldValue, null, '  ')}
            newValue={JSON.stringify(auditLog.fieldChange.newValue, null, '  ')}
          />
        </div>
      </ModalDialog>
    );
  }
}
