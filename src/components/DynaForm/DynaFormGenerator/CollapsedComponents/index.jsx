import { FormContext } from 'react-forms-processor/dist';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import FormGenerator from '../';
import {
  isExpansionPanelErrored,
  isAnyExpansionPanelFieldVisible,
} from '../../../../forms/utils';
import ExpandMoreIcon from '../../../icons/ArrowRightIcon';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
  expPanelSummary: {
    flexDirection: 'row-reverse',
    paddingLeft: 0,
    minHeight: 'unset',
    height: 48,
    display: 'inline-flex',
    '& > .MuiExpansionPanelSummary-expandIcon': {
      padding: 0,
      margin: theme.spacing(-0.5, 0.5, 0, 0),
      '&.Mui-expanded': {
        transform: `rotate(90deg)`,
      },
    },
    '&.Mui-expanded': {
      minHeight: 0,
    },
    '& > .MuiExpansionPanelSummary-content': {
      margin: 0,
      '&.Mui-expanded': {
        margin: 0,
      },
    },
  },
  expansionPanel: {
    boxShadow: 'none',
    background: 'none',
  },
  expDetails: {
    padding: 0,
  },
}));

export default function CollapsedComponents(props) {
  const classes = useStyles();
  const { containers, fieldMap } = props;
  const transformedContainers =
    containers &&
    containers.map((container, index) => {
      const { label: header, collapsed = true, ...rest } = container;

      return (
        // eslint-disable-next-line react/no-array-index-key
        <FormContext.Consumer key={index}>
          {form => (
            // eslint-disable-next-line react/no-array-index-key
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
  const [visible, setVisible] = useState(true);
  const [componentLoaded, setComponentLoaded] = useState(false);
  const isPanelErrored = isExpansionPanelErrored(
    { layout, fieldMap },
    form.fields
  );

  useEffect(() => {
    if (!shouldExpand && isPanelErrored) {
      setShouldExpand(true);
    }
  }, [isPanelErrored, shouldExpand]);
  useEffect(() => {
    setComponentLoaded(true);
  }, []);

  // we need to let the component mount and the field state settle before determing if they need to be removed
  useEffect(() => {
    if (componentLoaded) {
      if (isAnyExpansionPanelFieldVisible({ layout, fieldMap }, form.fields))
        setVisible(true);
      else setVisible(false);
    }
  }, [componentLoaded, fieldMap, form.fields, layout]);

  if (!visible) return null;

  return (
    <div className={classes.child}>
      <ExpansionPanel
        className={classes.expansionPanel}
        // eslint-disable-next-line react/no-array-index-key
        expanded={shouldExpand}>
        <ExpansionPanelSummary
          data-test={header}
          className={classes.expPanelSummary}
          onClick={() => setShouldExpand(expand => !expand)}
          expandIcon={<ExpandMoreIcon />}>
          <Typography>{header}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.expDetails}>
          <FormGenerator {...props} layout={layout} fieldMap={fieldMap} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};
