import { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import ViewRowIcon from '@material-ui/icons/HorizontalSplit';
import ZoomOutIcon from '@material-ui/icons/ZoomOutMap';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CodeEditor from '../../components/CodeEditor';
import actions from '../../actions';
import * as selectors from '../../reducers';
import './afe.css';

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
      minHeight: '150px',
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
    // the below css have no positive effects. :(
    cmOverride: {
      height: '100%', // calc(100% - 32px);
      overflow: 'auto' /* you can use hidden here as well */,
    },
    toolbarContainer: {
      marginLeft: `${theme.spacing.unit}px`,
      padding: `0px ${theme.spacing.unit * 2}px`,
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
  };
})
class AFE extends Component {
  state = {
    layout: 'Compact',
    fullScreen: false,
  };

  handleLayoutChange = (event, layout) => this.setState({ layout });
  handleFullScreenClick = () =>
    this.setState({ fullScreen: !this.state.fullScreen });

  componentDidMount() {
    const { processor, rules, data, handleInit } = this.props;

    handleInit(processor, rules, data);
  }

  render() {
    const {
      open,
      title,
      height,
      width,
      editor,
      onEditorClose,
      handlePreview,
      handleRuleChange,
      handleDataChange,
      classes,
    } = this.props;
    const { rules, data, result } = editor;
    const { layout, fullScreen } = this.state;
    const size = fullScreen ? { height: '81vh' } : { height, width };
    const gridTemplate = classes[`gridTemplate${layout}`];

    return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={onEditorClose}
        scroll="paper"
        maxWidth={false}>
        <div className={classes.toolbarContainer}>
          <div className={classes.toolbarItem}>
            <h3>{title}</h3>
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
              value="max"
              onClick={this.handleFullScreenClick}
              selected={fullScreen}>
              <ZoomOutIcon />
            </ToggleButton>
          </div>
        </div>
        <DialogContent>
          <div
            className={classNames(classes.gridContainer, gridTemplate)}
            style={size}>
            <div className={classNames(classes.gridItem, classes.rule)}>
              <div className={classes.title}>RULES</div>
              <CodeEditor
                value={rules}
                className={classes.cmOverride}
                options={{
                  editorDidMount: e => e.setSize(null, 'auto'),
                  mode: 'javascript',
                  theme: 'material',
                  lineNumbers: true,
                }}
                onChange={handleRuleChange}
              />
            </div>

            <div className={classNames(classes.gridItem, classes.data)}>
              <div className={classes.title}>DATA</div>
              <div>
                <CodeEditor
                  value={data}
                  options={{
                    mode: 'javascript',
                    theme: 'material',
                    lineNumbers: true,
                  }}
                  onChange={handleDataChange}
                />
              </div>
            </div>

            <div className={classNames(classes.gridItem, classes.result)}>
              <div className={classes.title}>RESULT</div>
              {result && result.data}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreview}>Preview</Button>
          <Button onClick={onEditorClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onEditorClose}>Save</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AFE);
