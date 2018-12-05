import { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

@withStyles(theme => ({
  gridContainer: {
    display: 'grid',
    gridGap: `${theme.spacing.double}px`,
    alignItems: 'stretch',
    height: '100%',
  },
}))
export default class PanelGrid extends Component {
  render() {
    const { children, height, width, classes, className } = this.props;
    const size = { height, width };

    return (
      <div
        className={classNames(classes.gridContainer, className)}
        style={size}>
        {children}
      </div>
    );
  }
}
