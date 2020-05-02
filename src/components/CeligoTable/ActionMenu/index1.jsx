// import { Fragment, useState } from 'react';
// import { Menu, MenuItem } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
// import EllipsisHorizontalIcon from '../../icons/EllipsisHorizontalIcon';

// const useStyles = makeStyles(theme => ({
//   wrapper: {
//     '& > .MuiMenu-paper': {
//       marginLeft: theme.spacing(-2),
//       width: '100px',
//     },
//   },
// }));

// export default function NewActionMenu({ actions = [] }) {
//   const classes = useStyles();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const handleClick = event => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <Fragment>
//       <EllipsisHorizontalIcon onClick={handleClick} />
//       <Menu
//         elevation={2}
//         variant="menu"
//         className={classes.wrapper}
//         anchorEl={anchorEl}
//         keepMounted
//         open={Boolean(anchorEl)}
//         onClose={handleClose}>
//         {actions.map(action => (
//           <MenuItem onClick={handleClose} key={action.label}>
//             {action.component}
//           </MenuItem>
//         ))}
//       </Menu>
//     </Fragment>
//   );
// }
