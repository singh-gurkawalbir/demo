import { Component, cloneElement } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import ViewRowIcon from '@material-ui/icons/HorizontalSplit';
import ZoomOutIcon from '@material-ui/icons/ZoomOutMap';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const mapStateToProps = (state, { id }) => ({
  editor: selectors.editor(state, id),
});
const mapDispatchToProps = (dispatch, { id }) => ({
  handlePreview: () => {
    dispatch(actions.editor.evaluateRequest(id));
  },
});

@withStyles(theme => ({
  dialogContent: {
    paddingBottom: 0,
  },
  toolbarContainer: {
    margin: `0 ${theme.spacing.unit}px`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: 'flex',
  },
  toolbarItem: {
    flex: '1 1 auto',
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // background: theme.palette.background.default,
  },
  fullScreen: {
    marginLeft: `${theme.spacing.unit * 2}px`,
  },
  actions: {
    marginRight: theme.spacing.unit * 3 - 2,
    marginBottom: theme.spacing.unit * 1.5,
  },
}))
class EditorDialog extends Component {
  state = {
    layout: 'compact',
    fullScreen: false,
  };

  handleClose = shouldCommit => {
    const { editor, onClose } = this.props;

    if (onClose) {
      onClose(shouldCommit, editor);
    }
  };
  handleLayoutChange = (event, layout) => layout && this.setState({ layout });
  handleFullScreenClick = () =>
    this.setState({ fullScreen: !this.state.fullScreen });

  componentDidMount() {
    const { layout = 'compact', fullScreen = false } = this.props;

    this.setState({ layout, fullScreen });
  }

  render() {
    const {
      children,
      open = true,
      title,
      handlePreview,
      showLayoutOptions = true,
      showFullScreen = true,
      classes,
      width = '70vw',
      height = '50vh',
      editor,
    } = this.props;
    const { layout, fullScreen } = this.state;
    const size = fullScreen ? { height } : { height, width };

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => this.handleClose()}
        scroll="paper"
        maxWidth={false}>
        <div className={classes.toolbarContainer}>
          <div className={classes.toolbarItem}>
            <Typography variant="h5">{title}</Typography>
          </div>
          <div className={classes.toggleContainer}>
            {showLayoutOptions && (
              <ToggleButtonGroup
                value={layout}
                exclusive
                onChange={this.handleLayoutChange}>
                <ToggleButton value="column">
                  <ViewColumnIcon />
                </ToggleButton>
                <ToggleButton value="compact">
                  <ViewCompactIcon />
                </ToggleButton>
                <ToggleButton value="row">
                  <ViewRowIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            )}
            {showFullScreen && (
              <ToggleButton
                className={classes.fullScreen}
                value="max"
                onClick={this.handleFullScreenClick}
                selected={fullScreen}>
                <ZoomOutIcon />
              </ToggleButton>
            )}
          </div>
        </div>
        <DialogContent style={size} className={classes.dialogContent}>
          {children && cloneElement(children, { layout })}
        </DialogContent>
        <DialogActions className={classes.actions}>
          {!editor.autoEvaluate && (
            <Button onClick={handlePreview}>Preview</Button>
          )}
          <Button
            variant="contained"
            onClick={() => this.handleClose()}
            color="secondary">
            Cancel
          </Button>
          <Button variant="contained" onClick={() => this.handleClose(true)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps, mapDispatchToProps)(EditorDialog);
