import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DoneIcon from '@material-ui/icons/Done';
import Paper from '@material-ui/core/Paper';

@withStyles(theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }),
}))
export default class LoadingList extends Component {
  static propTypes = {
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        done: PropTypes.bool.isRequired,
      })
    ).isRequired,
  };

  // static defaultProps = {
  //   propName: value,
  // };

  render() {
    const { steps } = this.props;

    return (
      <Paper>
        <List>
          {steps.map(e => (
            <ListItem key={e.name}>
              {e.done && (
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
              )}
              <ListItemText inset primary={e.name} />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }
}
