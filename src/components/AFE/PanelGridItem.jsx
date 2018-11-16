import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

@withStyles(theme => ({
  gridItem: {
    border: `solid 1px ${theme.palette.primary.light}`,
    overflow: 'hidden',
    minWidth: '150px',
    minHeight: '100px',
  },
  flexContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  title: { flex: '0 0 auto' },
  panel: { flex: '1 1 100px', minHeight: '50px' },
}))
export default class PanelGridItem extends Component {
  render() {
    const { classes, children, gridArea } = this.props;

    if (!children.length) {
      return (
        <div className={classes.gridItem} style={{ gridArea }}>
          {children}
        </div>
      );
    }

    return (
      <div className={classes.gridItem} style={{ gridArea }}>
        <div className={classes.flexContainer}>
          <div className={classes.title}>{children[0]}</div>
          <div className={classes.panel}>{children[1]}</div>
        </div>
      </div>
    );
  }
}
