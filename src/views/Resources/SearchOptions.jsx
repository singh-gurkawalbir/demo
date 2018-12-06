import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as selectors from '../../reducers';
import actions, { availableResources } from '../../actions';

const filterName = 'allResources';
const mapStateToProps = state => {
  const filter = selectors.filter(state, filterName) || {};

  return { keyword: filter.keyword || '' };
};

const mapDispatchToProps = dispatch => ({
  handleKeywordChange: event => {
    const keyword = event.target.value;

    dispatch(actions.patchFilter(filterName, { keyword }));
    availableResources.forEach(resourceType => {
      dispatch(actions.clearFilter(resourceType));
    });
  },
});

@hot(module)
@withStyles(() => ({
  textField: {
    marginTop: 0,
    width: '100%',
  },
}))
class SearchOptions extends Component {
  // TODO: see this gist for how to bind window events to react components
  // I want this so that as a user types, the keys automatically
  // are placed in the search.
  // https://gist.github.com/eliperelman/068e47353eaf526716d97185429c317d

  render() {
    const { classes, keyword, handleKeywordChange } = this.props;

    return (
      <div>
        <TextField
          onChange={handleKeywordChange}
          value={keyword}
          id="search"
          label="Keyword Search"
          type="search"
          className={classes.textField}
          margin="normal"
        />
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(SearchOptions);
