import { FormContext } from 'react-forms-processor/dist';
import { useState } from 'react';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import FormGenerator from '../';
import { isExpansionPanelErrored } from '../../../../forms/utils';

export default function CollapsedComponents(props) {
  const { containers, fieldMap, classes } = props;
  const transformedContainers =
    containers &&
    containers.map((container, index) => {
      const { label: header, collapsed = true, ...rest } = container;

      return (
        // eslint-disable-next-line react/no-array-index-key
        <FormContext.Consumer key={index}>
          {form => (
            <ExpansionPannelExpandOnInValidState
              collapsed={collapsed}
              index={index}
              layout={rest}
              formState={form}
              classes={classes}
              header={header}
              fieldMap={fieldMap}
            />
          )}
        </FormContext.Consumer>
      );
    });

  return <div className={classes.fieldsContainer}>{transformedContainers}</div>;
}

const ExpansionPannelExpandOnInValidState = props => {
  const {
    collapsed,
    layout,
    formState: form,
    classes,
    header,
    fieldMap,
  } = props;
  const [shouldExpand, setShouldExpand] = useState(!collapsed);

  return (
    <ExpansionPanel
      // eslint-disable-next-line react/no-array-index-key
      expanded={
        isExpansionPanelErrored({ layout, fieldMap }, form.fields) ||
        shouldExpand
      }
      className={classes.child}>
      <ExpansionPanelSummary
        data-test={header}
        onClick={() => setShouldExpand(expand => !expand)}
        expandIcon={<ExpandMoreIcon />}>
        <Typography>{header}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <FormGenerator layout={layout} fieldMap={fieldMap} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
