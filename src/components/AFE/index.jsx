import { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
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
import CodeEditor from '../../components/CodeEditor2';
import actions from '../../actions';
import * as selectors from '../../reducers';
// import './afe.css';
import processorDefaults from './processorDefaults';

const mapStateToProps = (state, { id }) => ({
  editor: selectors.editor(state, id),
});
const mapDispatchToProps = (dispatch, { id }) => ({
  handleRuleChange: rules => {
    dispatch(actions.editor.ruleChange(id, rules));
  },
  handleDataChange: data => {
    dispatch(actions.editor.dataChange(id, data));
  },
  handleInit: (processor, rules, data) => {
    dispatch(actions.editor.init(id, processor, rules, data));
  },
  handlePreview: () => {
    dispatch(actions.editor.evaluateRequest(id));
  },
});

@withStyles(theme => {
  const gridItemBorder = `solid 1px ${theme.palette.primary.light}`;

  return {
    dialogContent: {
      paddingBottom: 0,
    },
    gridContainer: {
      display: 'grid',
      gridGap: '5px',
      alignItems: 'stretch',
      height: '100%',
    },
    gridTemplateCompact: {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gridTemplateAreas: '"rule data" "rule result"',
    },
    gridTemplateRow: {
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr 1ft 1fr',
      gridTemplateAreas: '"rule" "data" "result"',
    },
    gridTemplateColumn: {
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: '1fr',
      gridTemplateAreas: '"rule data result"',
    },
    gridItem: {
      border: gridItemBorder,
      overflow: 'hidden',
      minWidth: '150px',
      minHeight: '100px',
    },
    rule: {
      gridArea: 'rule',
    },
    data: {
      gridArea: 'data',
    },
    result: {
      gridArea: 'result',
    },
    title: {
      paddingLeft: theme.spacing.unit,
      backgroundColor: theme.palette.primary.main,
      borderBottom: gridItemBorder,
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
  };
})
class AFE extends Component {
  state = {
    layout: 'Compact',
    fullScreen: false,
  };

  handleClose = shouldCommit => {
    const { editor, onEditorClose } = this.props;

    onEditorClose(shouldCommit, editor);
  };
  handleLayoutChange = (event, layout) => layout && this.setState({ layout });
  handleFullScreenClick = () =>
    this.setState({ fullScreen: !this.state.fullScreen });

  componentDidMount() {
    const { processor, rules, data, handleInit, overrides } = this.props;
    const config = {
      ...processorDefaults.global,
      ...processorDefaults[processor],
      ...overrides,
    };

    this.setState({ layout: config.layout, fullScreen: config.fullScreen });
    handleInit(processor, rules, data);
  }

  render() {
    const {
      open,
      title,
      overrides,
      editor,
      handlePreview,
      handleRuleChange,
      handleDataChange,
      classes,
      processor,
    } = this.props;
    const { rules, data, result } = editor;
    const { layout, fullScreen } = this.state;
    const gridTemplate = classes[`gridTemplate${layout}`];
    const config = {
      ...processorDefaults.global,
      ...processorDefaults[processor],
      ...overrides,
    };
    const size = fullScreen
      ? { height: '87vh' }
      : { height: config.height, width: config.width };

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
            <ToggleButtonGroup
              value={layout}
              exclusive
              onChange={this.handleLayoutChange}>
              <ToggleButton value="Column">
                <ViewColumnIcon />
              </ToggleButton>
              <ToggleButton value="Compact">
                <ViewCompactIcon />
              </ToggleButton>
              <ToggleButton value="Row">
                <ViewRowIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButton
              className={classes.fullScreen}
              value="max"
              onClick={this.handleFullScreenClick}
              selected={fullScreen}>
              <ZoomOutIcon />
            </ToggleButton>
          </div>
        </div>
        <DialogContent className={classes.dialogContent}>
          <div
            className={classNames(classes.gridContainer, gridTemplate)}
            style={size}>
            <div className={classNames(classes.gridItem, classes.rule)}>
              <div className={classes.title}>{config.rulesTitle}</div>
              <CodeEditor
                // ref={c => (this.ruleEditor = c)}
                name="rules"
                value={rules}
                mode={config.rulesMode}
                showGutter={config.rulesShowGutter}
                enableLiveAutocompletion={config.rulesEnableLiveAutocompletion}
                onChange={handleRuleChange}
              />
            </div>

            <div className={classNames(classes.gridItem, classes.data)}>
              <div className={classes.title}>{config.dataTitle}</div>
              <CodeEditor
                // ref={c => (this.dataEditor = c)}
                name="data"
                value={data}
                mode={config.dataMode}
                showGutter={config.dataShowGutter}
                enableLiveAutocompletion={config.dataEnableLiveAutocompletion}
                onChange={handleDataChange}
              />
            </div>

            <div className={classNames(classes.gridItem, classes.result)}>
              <div className={classes.title}>{config.resultTitle}</div>
              {result && result.data}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreview}>Preview</Button>
          <Button onClick={() => this.handleClose()} color="primary">
            Cancel
          </Button>
          <Button onClick={() => this.handleClose(true)}>Save</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AFE);
