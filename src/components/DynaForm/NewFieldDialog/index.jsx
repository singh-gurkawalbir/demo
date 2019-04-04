import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import FormDialog from '../../FormDialog';

@withStyles(() => ({
  editorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    width: '75vh',
  },
}))
export default class NewFieldDialog extends Component {
  render() {
    const { classes, ...rest } = this.props;

    return (
      <FormDialog {...rest}>
        <Typography variant="h5">Not yet implemented....</Typography>
      </FormDialog>
    );
  }
}
