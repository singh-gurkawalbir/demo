import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextToggle from '../../../../TextToggle';

const useStyles = makeStyles(theme => ({
  textToggleContainer: {
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
  },
  toggleButtons: {
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
        borderTopRightRadius: '24px !important',
        borderBottomRightRadius: '24px !important',
      },
      '&.Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
        },
      },
      '&:not(:first-child)': {
        borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
        borderRadius: 0,
      },
    },
  },
}));

export default function HeaderPanel(props) {
  const { handlePanelViewChange, availablePreviewStages, panelType } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.textToggleContainer}>
      <TextToggle
        value={panelType}
        className={classes.toggleButtons}
        onChange={handlePanelViewChange}
        exclusive
        options={availablePreviewStages}

      />
    </div>
  );
}
