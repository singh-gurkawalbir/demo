import { Component } from 'react';
import { Form, FormFragment } from 'integrator-ui-forms/packages/core/dist';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import getRenderer from './renderer';

@withStyles(theme => ({
  fieldContainer: {
    maxHeight: `60vh`,
    overflowY: 'auto',
    paddingRight: theme.spacing.unit,
  },
}))
export default class DynaForm extends Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes, children, fieldMeta, ...rest } = this.props;
    const { expanded } = this.state;
    const { fields, fieldSets } = fieldMeta;
    const renderer = getRenderer();

    if (!fields || !fieldSets) {
      return null;
    }

    return (
      <Form {...rest} renderer={renderer}>
        <div className={classes.fieldContainer}>
          {fields && <FormFragment defaultFields={fields} />}
          {fieldSets &&
            fieldSets.map((set, i) => (
              <ExpansionPanel
                key={set.header}
                square
                expanded={expanded === i}
                onChange={this.handleChange(i)}>
                <ExpansionPanelSummary>
                  <Typography>{set.header}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <FormFragment defaultFields={set.fields} />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
        </div>
        {children}
      </Form>
    );
  }
}

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0,0,0,.125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  },
  expanded: {
    margin: 'auto',
  },
})(MuiExpansionPanel);
const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0,0,0,.03)',
    borderBottom: '1px solid rgba(0,0,0,.125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    display: 'block',
    padding: theme.spacing.unit * 2,
  },
}))(MuiExpansionPanelDetails);
