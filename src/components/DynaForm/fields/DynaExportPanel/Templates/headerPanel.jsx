import { makeStyles } from '@material-ui/core/styles';
import TextToggle from '../../../../../components/TextToggle';

const useStyles = makeStyles(theme => ({
  textToggleContainer: {
    textAlign: 'center',
    position: 'relative',
    zIndex: 2,
  },
  textToggle: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    '& > button': {
      height: 30,
      padding: theme.spacing(0, 5),
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
    },
  },
}));

export default function HeaderPanel(props) {
  const { handlePanelViewChange, availablePreviewStages, panelType } = props;
  const classes = useStyles();

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
