import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import RootRef from '@material-ui/core/RootRef';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ArrowPopper from '../../../components/ArrowPopper';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import DownArrow from '../../../icons/DownArrow';

const mapStateToProps = state => ({
  accounts: selectors.accountSummary(state),
});
const mapDispatchToProps = dispatch => ({
  onAccountChange: (id, environment) => {
    dispatch(
      actions.profile.updatePreferences({ defaultAShareId: id, environment })
    );
  },
});

@withStyles(theme => ({
  currentAccount: {
    padding: theme.spacing.unit,
    color: theme.appBar.contrast,
  },
  currentContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  selected: {
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#00ea00',
      left: 8,
      top: '50%',
      marginTop: -3,
    },
  },
  itemContainer: {
    '& button': { display: 'none' },
    '&:hover button': {
      display: 'block',
    },
  },
  itemRoot: {
    paddingRight: 68,
  },
  leave: {
    // display: 'none',
  },
  arrow: {
    fill: theme.appBar.contrast,
  },
}))
class AccountList extends Component {
  state = {
    anchorEl: null,
    open: false,
  };

  accountArrowRef = React.createRef();

  handleClick = () => {
    // console.log('handleClick');
    this.setState(state => ({
      open: !state.open,
    }));
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    this.setState({
      anchorEl: this.accountArrowRef.current,
    });
  }

  render() {
    const { open, anchorEl } = this.state;
    const { classes, accounts, onAccountChange } = this.props;

    if (!accounts || accounts.length === 0) {
      return null;
    }

    return (
      <Fragment>
        <span onClick={this.handleClick} className={classes.currentContainer}>
          <Typography
            className={classes.currentAccount}
            aria-owns={open ? 'accountList' : null}
            aria-haspopup="true">
            {accounts.find(a => a.selected).label}
          </Typography>
          <RootRef rootRef={this.accountArrowRef}>
            <DownArrow className={classes.arrow} />
          </RootRef>
        </span>

        <ArrowPopper
          id="accountList"
          className={classes.popper}
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          onClose={this.handleClose}>
          <List dense>
            {accounts.map(a => (
              <ListItem
                button
                onClick={() => {
                  onAccountChange(a.id, a.environment);
                }}
                classes={{
                  root: classes.itemRoot,
                  container: classes.itemContainer,
                }}
                key={`${a.id}-${a.environment}`}>
                <ListItemText
                  classes={{ root: a.selected && classes.selected }}
                  primary={a.label}
                />
                {a.environment === 'production' && (
                  <ListItemSecondaryAction>
                    <Button className={classes.leave} variant="text">
                      Leave
                    </Button>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        </ArrowPopper>
      </Fragment>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(AccountList);
