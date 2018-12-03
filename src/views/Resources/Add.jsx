import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TimeAgo from 'react-timeago';
import actions from '../../actions';
import * as selectors from '../../reducers';
import CodeEditor from '../../components/CodeEditor';

const mapStateToProps = (state, ownProps) => {
  const { id, resourceType } = ownProps.match.params;
  const newResourceData = selectors.newResourceData(state, resourceType, id);

  return {
    resourceType,
    newResourceData,
    id,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { id, resourceType } = ownProps.match.params;

  return {
    patchAndCommit: newResource => {
      const patch = [
        {
          op: 'replace',
          path: '/',
          value: newResource,
        },
      ];

      dispatch(actions.resource.patchStaged(id, patch));
      dispatch(actions.resource.commitStaged(resourceType, id));
    },
  };
};

const toName = resourceType =>
  resourceType.charAt(0).toUpperCase() + resourceType.slice(1, -1);

@hot(module)
@withStyles(theme => ({
  editableFields: {
    paddingTop: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '90%',
  },
}))
class Add extends Component {
  state = {
    dirty: false,
    editorValue: '',
    lastChange: undefined,
  };

  componentDidMount() {
    const { merged } = this.props.newResourceData;
    const resourceAsJson = JSON.stringify(merged, null, 2);

    // console.log('componentDidMount:', this.props.id);

    this.setState({
      dirty: false,
      editorValue: resourceAsJson,
      lastChange: undefined,
      error: undefined,
    });
  }

  handleInputChange = editorValue => {
    this.setState({
      dirty: true,
      editorValue,
      lastChange: Date.now(),
      error: undefined,
    });
  };

  handleSave = () => {
    const { patchAndCommit } = this.props;
    const { editorValue } = this.state;

    try {
      const newResource = JSON.parse(editorValue);

      patchAndCommit(newResource);
    } catch (e) {
      this.setState({
        error: e.message,
      });
    }
  };

  render() {
    const { id, resourceType, classes } = this.props;
    const { editorValue, lastChange, dirty, error } = this.state;

    return (
      <div key={id}>
        <Typography variant="h5">New {`${toName(resourceType)}.`}</Typography>

        {dirty && (
          <Typography variant="caption" className={classes.dates}>
            Unsaved changes made <TimeAgo date={Date(lastChange)} /> ago.
          </Typography>
        )}

        <div className={classes.editableFields}>
          <CodeEditor
            value={editorValue}
            options={{ mode: 'javascript' }}
            onChange={this.handleInputChange}
            mode="javascript"
          />
          {error && <Typography color="error">{error}</Typography>}
          {dirty && (
            <div>
              <Button onClick={this.handleSave} size="small" color="secondary">
                Create {`${toName(resourceType)}`}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Add);
