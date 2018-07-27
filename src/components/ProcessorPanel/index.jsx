import { Component } from 'react';
import { arrayOf, func, shape, string } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';

const processor = shape({
  name: string,
  label: string,
  description: string,
});

@withStyles(theme => ({
  column: {
    flexBasis: '33.33%',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  paper: {
    margin: `${theme.spacing.double}px 0`,
  },
}))
export default class ProcessorPanel extends Component {
  static propTypes = {
    onProcessorChange: func.isRequired,
    processors: arrayOf(processor).isRequired,
    processor,
  };

  static defaultProps = {
    processor: null,
  };

  render() {
    const { classes, processor, processors, onProcessorChange } = this.props;

    if (!processor || !processor.name) {
      return (
        <Paper elevation={2} className={classes.paper}>
          <List dense>
            {processors.map(processorItem => (
              <ListItem
                button
                key={processorItem.name}
                onClick={() => onProcessorChange(processor, processorItem)}>
                <ListItemText
                  primary={processorItem.label}
                  secondary={processorItem.description}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      );
    }

    return (
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<ChevronDownIcon />}>
          <div className={classes.column}>
            <Typography className={classes.heading}>
              {processor.label}
            </Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>
              {processor.description}
            </Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>inside here goes the content</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
