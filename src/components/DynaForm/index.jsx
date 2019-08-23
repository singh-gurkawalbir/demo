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
    backgroundColor: theme.palette.background.editorInner,
    borderColor: 'rgb(0,0,0,0.1)',
    minHeight: '30vh',
    maxHeight: `60vh`,
    overflowY: 'auto',
    padding: theme.spacing(1),
  },
  details: {
    display: 'block',
    paddingRight: theme.spacing(1),
  },
  actions: {
    textAlign: 'right',
    padding: theme.spacing(0.5),
  },
}))
export default class DynaForm extends Component {
  render() {
    const {
      classes,
      children,
      editMode,
      fieldMeta,
      resourceId,
      resourceType,
      ...rest
    } = this.props;
    const { fields, fieldSets } = fieldMeta;
    const renderer = getRenderer(editMode, fieldMeta, resourceId, resourceType);

    if (!fields && !fieldSets) {
      return null;
    }

    return (
      <Form {...rest} renderer={renderer}>
        <div className={classes.fieldContainer}>
          {fields && <FormFragment defaultFields={fields} />}
          {fieldSets &&
            fieldSets.map(set => (
              <ExpansionPanel defaultExpanded={!set.collapsed} key={set.header}>
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
        {/* The children are action buttons for the form */}

        <div className={classes.actions}>{children}</div>
      </Form>
    );
  }
}
