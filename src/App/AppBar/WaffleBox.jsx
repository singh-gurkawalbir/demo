import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowPopper from '../../components/ArrowPopper';
import WaffleButton from './WaffleButton';
import WaffleIcon from './WaffleIcon';

@withStyles(theme => ({
  waffleIcon: {
    fill: theme.appBarContrast,
    width: 21,
    height: 21,
  },
  wafflePopper: {
    width: '300px',
    maxHeight: '450px',
    padding: `${theme.spacing.unit}px ${theme.spacing.double}px`,
    display: 'flex',
    flexWrap: 'wrap',
    overflowY: 'auto',
  },
  buttonContainer: {
    flex: 'auto',
    width: 70,
    padding: theme.spacing.unit,
  },
}))
export default class WaffleBox extends Component {
  state = {
    anchorEl: null,
  };

  handleMenu = event => {
    if (this.state.anchorEl) {
      this.setState({ anchorEl: null });
    } else {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl, open } = this.state;
    const { classes } = this.props;
    const buttons = [
      { title: 'Editors', path: '/pg/editors' },
      { title: 'Resources', path: '/pg/resources' },
      { title: 'Exports', path: '/pg/exports' },
      { title: 'Imports', path: '/pg/imports' },
      { title: 'Home', path: '/pg' },
      { title: 'Home 2', path: '/pg' },
      { title: 'Home 3', path: '/pg' },
      { title: 'Home 4', path: '/pg' },
      { title: 'Home 5', path: '/pg' },
      { title: 'Home 6', path: '/pg' },
    ];

    return (
      <Fragment>
        <IconButton
          aria-owns={open ? 'profileOptions' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}>
          <WaffleIcon className={classes.waffleIcon} />
        </IconButton>
        <ArrowPopper
          className={classes.wafflePopper}
          id="waffleBox"
          onClose={this.handleClose}
          anchorEl={anchorEl}>
          {buttons.map(b => (
            <div key={b.title} className={classes.buttonContainer}>
              <WaffleButton
                to={b.path}
                title={b.title}
                onClick={this.handleClose}
              />
            </div>
          ))}
        </ArrowPopper>
      </Fragment>
    );
  }
}
