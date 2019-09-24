import { Chip, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Fragment, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

export default function ChipInput(props) {
  const classes = useStyles();
  const { onChange, value } = props;
  const [tag, setTag] = useState(value);
  const [isChipView, setIsChipView] = useState(true);
  const handleBlur = e => {
    e.preventDefault();
    setIsChipView(true);
    setTag(e.target.value);
    onChange(e.target.value);
  };

  const handleTagClick = e => {
    e.preventDefault();
    setIsChipView(false);
  };

  return (
    <Fragment>
      {isChipView && (
        <Chip
          {...props}
          onClick={handleTagClick}
          label={tag}
          size="small"
          icon={<EditIcon />}
        />
      )}
      {!isChipView && (
        <TextField
          id="integration-tag"
          autoFocus
          defaultValue={tag}
          className={classes.textField}
          //   onChange={handleTagChange}
          onBlur={handleBlur}
        />
      )}
    </Fragment>
  );
}
