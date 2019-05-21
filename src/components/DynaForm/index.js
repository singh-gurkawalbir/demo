import { Component } from 'react';
import { Form, FormFragment } from 'react-forms-processor/dist';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import getRenderer from './renderer';

@withStyles(theme => ({
  fieldContainer: {
    border: 'solid 1px',
    backgroundColor: theme.palette.background.default,
    borderColor: 'rgb(0,0,0,0.1)',
    maxHeight: `60vh`,
    overflowY: 'auto',
    padding: theme.spacing.unit,
  },
  details: {
    display: 'block',
    paddingRight: theme.spacing.unit,
  },
}))
export default class DynaForm extends Component {
  render() {
    const {
      classes,
      children,
      editMode,
      onMetaChange,
      fieldMeta,
      ...rest
    } = this.props;
    const { fields, fieldSets } = fieldMeta;
    const renderer = getRenderer(editMode, onMetaChange);

    if (!fields && !fieldSets) {
      return null;
    }

    return (
      <Form {...rest} renderer={renderer}>
        <div className={classes.fieldContainer}>
          {fields && <FormFragment defaultFields={fields} />}
          {fieldSets &&
            fieldSets.map(set => (
              <ExpansionPanel key={set.header}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>
                    {set.header}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details}>
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
