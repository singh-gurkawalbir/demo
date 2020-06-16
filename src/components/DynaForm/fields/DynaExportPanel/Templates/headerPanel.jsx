import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextToggle from '../../../../TextToggle';

const useStyles = makeStyles(theme => ({
  textToggleContainer: {
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
  },
  textToggle: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    padding: 1,
    borderColor: theme.palette.secondary.lightest,
    '& > button': {
      height: 30,
      padding: theme.spacing(0, 5),
      '&:first-child': {
        borderRadius: props => props.availablePreviewStages.length > 1 ? [[24, 0, 0, 24]] : 'none',
      },
      '&:last-child': {
        height: 30,
        padding: theme.spacing(0, 5),
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
        },
      },
      '&:not(:first-child)': {
        borderRadius: '0px !important',
        borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
      },
    },
  },
}));

export default function HeaderPanel(props) {
  const { handlePanelViewChange, availablePreviewStages, panelType } = props;
  const classes = useStyles(props);
  console.log('checking the length of options', availablePreviewStages);
  return (
    <div className={classes.textToggleContainer}>
      <TextToggle
        value={panelType}
        className={classes.textToggle}
        onChange={handlePanelViewChange}
        exclusive
        options={availablePreviewStages}

      />
    </div>
  );
}
