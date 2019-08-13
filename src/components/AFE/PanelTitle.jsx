import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

@withStyles(theme => ({
  title: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.editor.panelBackground,
    // color: theme.palette.text.main,
    borderBottom: `solid 1px ${theme.editor.panelBorder}`,
  },
}))
export default class PanelTitle extends Component {
  render() {
    const { title, children, classes } = this.props;

    return (
      <div className={classes.title}>
        {title ? <Typography variant="body1">{title}</Typography> : children}
      </div>
    );
  }
}
