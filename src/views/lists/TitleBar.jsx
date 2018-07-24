import { hot } from 'react-hot-loader';
import { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

@hot(module)
@withStyles(theme => ({
  titleBox: {
    display: 'flex',
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
    flexBasis: '50%',
    flexShrink: 0,
  },
  textField: {
    marginTop: 0,
    width: '350px',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },
}))
export default class Exports extends Component {
  // TODO: see this gist for how to bind window events to react components
  // I want this so that as a user types, the keys automatically
  // are placed in the search.
  // https://gist.github.com/eliperelman/068e47353eaf526716d97185429c317d

  render() {
    const { classes, searchText, handleSearch, itemName } = this.props;

    return (
      <div className={classes.titleBox}>
        <Typography className={classes.title} variant="display1">
          Your {itemName}
        </Typography>
        <Typography className={classes.secondaryHeading}>
          <TextField
            onChange={handleSearch}
            value={searchText}
            id="search"
            label={`Search by ${itemName}, Connection or Application`}
            type="search"
            className={classes.textField}
            margin="normal"
          />
        </Typography>
      </div>
    );
  }
}
