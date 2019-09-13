import { FormFragment } from 'react-forms-processor/dist';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useState } from 'react';
import { Tabs, Tab } from '@material-ui/core';

// TODO: Azhar please review this styling
const useStyles = makeStyles({
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  child: {
    flexBasis: '100%',
    paddingRight: 10,
    '&:last-child': {
      paddingRight: 0,
    },
  },
});
const TabComponent = props => {
  const { containers, classes, fieldMap } = props;
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = containers.map((set, index) => {
    const { label: header } = set;

    // eslint-disable-next-line react/no-array-index-key
    return <Tab className={classes.child} label={header} key={index} />;
  });
  const tabPannels = containers.map((fieldSet, index) => {
    const { label, ...layout } = fieldSet;

    return (
      // eslint-disable-next-line react/no-array-index-key
      <div key={index} className={classes.child}>
        {selectedTab === index && (
          <FormGenerator layout={layout} fieldMap={fieldMap} />
        )}
      </div>
    );
  });

  return (
    <div>
      <Tabs
        value={selectedTab}
        onChange={(evt, value) => {
          setSelectedTab(value);
        }}>
        {tabs}
      </Tabs>
      {tabPannels}
    </div>
  );
};

const CollapsedComponents = props => {
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
};

const ColumnComponents = props => {
  const { containers, fieldMap, classes } = props;
  const transformedContainers =
    containers &&
    containers.map((container, index) => {
      const { label: header, ...rest } = container;

      return (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className={classes.child}>
          {header && <Typography>{header}</Typography>}
          <FormGenerator layout={rest} fieldMap={fieldMap} />
        </div>
      );
    });

  return <div className={classes.container}>{transformedContainers}</div>;
};

const getCorrespondingfieldMap = (fields, fieldMap) =>
  fields.map(field => {
    const transformedFieldValue = fieldMap[field];

    if (!transformedFieldValue) {
      // eslint-disable-next-line no-console
      console.warn('no field reference found for field ', field);

      return {};
    }

    return { key: field, ...transformedFieldValue };
  });

export default function FormGenerator(props) {
  const classes = useStyles();

  if (!props || !props.layout || !props.fieldMap) return null;
  const { fieldMap, layout } = props;
  const { fields, containers, type } = layout;
  const fieldsComponent = fields && (
    <FormFragment
      className={classes.child}
      defaultFields={getCorrespondingfieldMap(fields, fieldMap)}
    />
  );
  let ConvertedContainer;

  if (type === 'collapse') {
    ConvertedContainer = CollapsedComponents;
  } else if (type === 'column') {
    ConvertedContainer = ColumnComponents;
  } else if (type === 'tab') {
    ConvertedContainer = TabComponent;
  } else {
    return (
      <div className={classes.fieldsContainer}>
        {fieldsComponent}
        {containers &&
          containers.map((container, index) => (
            <FormGenerator
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              classes={classes}
              fieldMap={fieldMap}
              layout={container}
            />
          ))}
      </div>
    );
  }

  return (
    <div className={classes.fieldsContainer}>
      {fieldsComponent}
      <ConvertedContainer
        classes={classes}
        fieldMap={fieldMap}
        containers={containers}
      />
    </div>
  );
}
