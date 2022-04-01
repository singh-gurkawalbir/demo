import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '../../../../../../components/icons/AddIcon';
import { TextButton } from '../../../../../../components/Buttons';
import { DRAWER_URL_PREFIX } from '../../../../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  button: {
    padding: '4px 10px',
    marginRight: theme.spacing(0.5),
    color: theme.palette.secondary.light,
  },
}));

export default function CategoryMappingActions() {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const handleAddCategoryClick = () => {
    history.push(`${match.url}/${DRAWER_URL_PREFIX}/addCategory`);
  };

  return (
    <TextButton
      startIcon={<AddIcon />}
      data-test="addCategory"
      onClick={handleAddCategoryClick}
      className={classes.button}>
      Add category
      {/* TODO:Sravan we need to add the help for add category and variation mapping */}
    </TextButton>
  );
}
