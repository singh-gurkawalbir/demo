import { Component } from 'react';
import { connect } from 'react-redux';
// import 'react-awesome-query-builder/css/styles.scss';
// import 'react-awesome-query-builder/css/compact_styles.scss';
// import 'react-awesome-query-builder/css/denormalize.scss';
import { Query, Builder, Utils as QbUtils } from 'react-awesome-query-builder';
// import QueryBuilder from 'react-querybuilder';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const mapStateToProps = (state, { editorId }) => ({
  editor: selectors.editor(state, editorId),
});
const mapDispatchToProps = (dispatch, { editorId }) => ({
  patchEditor: (option, value) => {
    dispatch(actions.editor.patch(editorId, { [option]: value }));
  },
});
// const fields = [
//   { name: 'firstName', label: 'First Name' },
//   { name: 'lastName', label: 'Last Name' },
//   { name: 'age', label: 'Age' },
//   { name: 'address', label: 'Address' },
//   { name: 'phone', label: 'Phone' },
//   { name: 'email', label: 'Email' },
//   { name: 'twitter', label: 'Twitter' },
//   { name: 'isDev', label: 'Is a Developer?', value: false },
// ];

@withStyles(theme => ({
  container: {
    padding: '10px',
    backgroundColor: theme.palette.background.default,
    height: '100%',
    overflow: 'auto',
  },
  formControl: {
    margin: theme.spacing.unit,
    // minWidth: 120,
  },
  textField: {
    marginTop: theme.spacing.double,
  },
}))
class FilterPanel extends Component {
  //   handleQuery = query => {
  //     console.log(query);
  //   };
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        {/* <QueryBuilder fields={fields} onQueryChange={this.handleQuery} /> */}
        <Query
        //   {...config}
        // you can pass object here, see treeJSON at onChange
        // value=transit.fromJSON(treeJSON)
        //   get_children={this.getChildren}
        //   onChange={this.onChange}
        >
          <div>
            <div className="query-builder">
              <Builder {...this.props} />
            </div>
            {/* <div>
              Query string: {QbUtils.queryString(props.tree, props.config)}
            </div>
            <div>
              Mongodb query: {QbUtils.mongodbFormat(props.tree, props.config)}
            </div> */}
          </div>
        </Query>
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
