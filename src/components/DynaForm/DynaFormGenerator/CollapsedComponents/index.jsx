import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import FormGenerator from '../';

export default function CollapsedComponents(props) {
  const { containers, fieldMap, classes } = props;
  const transformedContainers =
    containers &&
    containers.map((container, index) => {
      const { label: header, collapsed = true, ...rest } = container;

      return (
        <ExpansionPanel
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          defaultExpanded={!collapsed}
          className={classes.child}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{header}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <FormGenerator layout={rest} fieldMap={fieldMap} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    });

  return <div className={classes.fieldsContainer}>{transformedContainers}</div>;
}
