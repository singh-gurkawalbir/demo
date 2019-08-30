import { FormFragment } from 'react-forms-processor/dist';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Fragment, useState } from 'react';
import { Tabs, Tab } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    'justify-content': 'space-evenly',
    'flex-direction': 'row',
    padding: theme.spacing(1),
  },

  fieldsContainer: {
    display: 'flex',
    'justify-content': 'space-evenly',
    'flex-direction': 'column',
    padding: theme.spacing(1),
  },
}));
const TabComponent = props => {
  const { fieldSets, classes } = props;
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = fieldSets.map((set, index) => {
    const { label: header } = set;

    // eslint-disable-next-line react/no-array-index-key
    return <Tab label={header} key={index} />;
  });
  const tabPannels = fieldSets.map((set, index) => {
    const { fields, containers } = set;

    return (
      // eslint-disable-next-line react/no-array-index-key
      <Fragment key={index}>
        {selectedTab === index && (
          <Fragment>
            <FormFragment defaultFields={fields} />
            <FormGenerator containers={containers} />
          </Fragment>
        )}
      </Fragment>
    );
  });

  return (
    <div className={classes.fieldsContainer}>
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

export default function FormGenerator(props) {
  const classes = useStyles();

  if (!props) return null;
  const { containers } = props;

  if (!containers || (containers && containers.length === 0)) {
    return null;
  }

  const convertedContainers = containers.map((container, index) => {
    const { type, fieldSets } = container;
    let convertedFieldSets;
    const supportedTypes = ['collapse', 'column', 'tab'];

    if (!type || !supportedTypes.includes(type)) {
      console.warn(
        'no type or incorrect type provided in the metadata ,supported types are',
        JSON.stringify(supportedTypes)
      );
    }

    if (type === 'collapse') {
      convertedFieldSets = fieldSets.map((set, index) => {
        const { label: header, fields, containers } = set;

        return (
          // eslint-disable-next-line react/no-array-index-key
          <ExpansionPanel key={index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{header}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.fieldsContainer}>
              <FormFragment defaultFields={fields} />
              <FormGenerator containers={containers} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      });
    } else if (type === 'column') {
      convertedFieldSets = fieldSets.map((set, index) => {
        const { label: header, fields, containers } = set;

        // TODO:its safe to use index for these elements since the metada is not expected to change
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className={classes.fieldsContainer}>
            <Typography>{header}</Typography>
            <FormFragment defaultFields={fields} />
            <FormGenerator containers={containers} />
          </div>
        );
      });
    } else if (type === 'tab') {
      convertedFieldSets = (
        <TabComponent classes={classes} fieldSets={fieldSets} />
      );
    }

    return (
      // eslint-disable-next-line react/no-array-index-key
      <div key={index} className={classes.container}>
        {convertedFieldSets}
      </div>
    );
  });

  return <div className={classes.container}>{convertedContainers}</div>;
}
