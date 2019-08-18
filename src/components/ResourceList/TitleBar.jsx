import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import Button from '@material-ui/core/Button';
import * as selectors from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../constants/resource';

const mapStateToProps = (state, { resourceType }) => {
  const filter = selectors.filter(state, resourceType);
  const keyword = filter ? filter.keyword || '' : '';

  return { keyword };
};

const mapDispatchToProps = (dispatch, { resourceType }) => ({
  handleKeywordChange: event => {
    const keyword = event.target.value;

    dispatch(actions.patchFilter(resourceType, { keyword, take: 3 }));
  },
});

@hot(module)
@withStyles(theme => ({
  titleBox: {
    display: 'flex',
  },
  title: {
    marginBottom: theme.spacing(2),
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
class TitleBar extends Component {
  // TODO: see this gist for how to bind window events to react components
  // I want this so that as a user types, the keys automatically
  // are placed in the search.
  // https://gist.github.com/eliperelman/068e47353eaf526716d97185429c317d

  render() {
    const {
      classes,
      keyword,
      handleKeywordChange,
      itemName,
      resourceType,
    } = this.props;

    return (
      <div className={classes.titleBox}>
        <Typography className={classes.title} variant="h4">
          Your {itemName}
        </Typography>
        <div className={classes.secondaryHeading}>
          <TextField
            onChange={handleKeywordChange}
            value={keyword}
            id="search"
            label={`Search by ${itemName}, Connection or Application`}
            type="search"
            className={classes.textField}
            margin="normal"
          />
        </div>
        <Button
          component={Link}
          to={getRoutePath(`${resourceType}/add/new-${shortid.generate()}`)}>
          + Create New {`${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}`}
        </Button>
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(TitleBar);
