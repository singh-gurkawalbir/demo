import { alpha } from '@mui/material/styles/';
import colors from './colors';

const appBarHeight = 36;

export default {
  spacing: 8,
  drawerWidth: 256,
  drawerWidthMinimized: 60,
  appBarHeight,
  pageBarHeight: 88,
  showMoreHeight: 96,

  palette: {
    mode: 'light',
    background: {
      paper: colors.celigoWhite,
      paper2: colors.celigoNeutral2,
      default: colors.celigoNeutral1,
      drawer: colors.celigoNeutral9,
      drawer2: colors.celigoNeutral8,
      drawer3: colors.celigoNeutral10,
      drawerActive: colors.celigoAccent1,
      toggle: colors.celigoNeutral7,
    },
    primary: {
      lightest2: colors.celigoAccent6,
      lightest: colors.celigoAccent5,
      light: colors.celigoAccent3,
      main: colors.celigoAccent2,
      dark: colors.celigoAccent1,
    },
    secondary: {
      lightest: colors.celigoNeutral3,
      light: colors.celigoNeutral6,
      main: colors.celigoNeutral8,
      dark: colors.celigoNeutral9,
      darkest: colors.celigoNeutral10,
      contrastText: colors.celigoNeutral4,
    },
    text: {
      disabled: colors.celigoNeutral4,
      primary: colors.celigoNeutral8,
      hint: colors.celigoNeutral5,
      secondary: colors.celigoNeutral6,
    },
    info: {
      main: colors.celigoAccent2,
      contrastText: colors.celigoWhite,
    },
    error: {
      main: colors.celigoError,
      dark: colors.celigoErrorDark,
      contrastText: colors.celigoWhite,
    },
    warning: {
      main: colors.celigoWarning,
      contrastText: colors.celigoWhite,
    },
    success: {
      main: colors.celigoSuccess,
      dark: colors.celigoSuccessDark,
      contrastText: colors.celigoWhite,
    },
  },
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    values: {
      xs: 0,
      sm: 640,
      md: 960,
      lg: 1280,
      xl: 1700,
      xxl: 1920,
    },
  },
  zIndex: {
    bubbleName: 0,
    bubble: 1,
  },
  // global overrides for MUI styles...
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'unset',
        fontFamily: 'Roboto400',
        padding: '6px 20px',
        fontSize: '13px',
        lineHeight: '15px',
        '&: disabled': {
          cursor: 'not-allowed',
        },
      },
      sizeSmall: {
        padding: 20,
      },
      contained: {
        border: '1px solid',
        boxShadow: 'none',
        '&:disabled': {
          background: 'none',
        },
      },
      containedPrimary: {
        borderColor: colors.celigoAccent2,
        color: colors.celigoWhite,
        '&:hover': {
          backgroundColor: colors.celigoAccent3,
          borderColor: colors.celigoAccent3,
          color: colors.celigoWhite,
        },
        '&:focus': {
          background: colors.celigoAccent2,
          borderColor: colors.celigoAccent2,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          background: colors.celigoNeutral2,
          borderColor: colors.celigoNeutral2,
        },
      },
      containedSecondary: {
        backgroundColor: colors.celigoWhite,
        borderColor: colors.celigoNeutral3,
        color: colors.celigoNeutral6,
        '&:hover': {
          color: colors.celigoNeutral7,
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent2,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          background: colors.celigoNeutral2,
          borderColor: colors.celigoNeutral3,
        },
      },
      outlined: {
        borderRadius: '4px',
        backgroundColor: colors.celigoWhite,
        borderColor: colors.celigoNeutral3,
        color: colors.celigoNeutral3,
        padding: '6px 20px',
        border: '1px solid',
        '&:disabled': {
          color: colors.celigoNeutral4,
          borderColor: colors.celigoNeutral2,
        },
      },
      outlinedPrimary: {
        borderColor: colors.celigoAccent2,
        color: colors.celigoAccent2,
        '&:hover': {
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent3,
          color: colors.celigoAccent3,
        },
      },
      outlinedSecondary: {
        borderColor: colors.celigoNeutral3,
        color: colors.celigoNeutral6,
        '&:hover': {
          color: colors.celigoAccent3,
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent3,
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
          borderColor: colors.celigoNeutral2,
        },
      },
      text: {
        fontSize: '13px',
        lineHeight: '15px',
        '&::after': {
          background: 'none repeat scroll 0 0 transparent',
          bottom: '0',
          content: '""',
          display: 'block',
          height: '1px',
          left: '50%',
          position: 'absolute',
          transition: 'width 0.3s ease 0s, left 0.3s ease 0s',
          width: '0',
        },
      },
      textPrimary: {
        color: colors.celigoAccent2,
        '&:focus': {
          color: colors.celigoNeutral7,
        },
        '&:hover': {
          color: colors.celigoAccent1,
          backgroundColor: 'inherit',
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
        },
      },
      textSecondary: {
        color: colors.celigoNeutral8,
        '&:focus': {
          color: colors.celigoNeutral8,
        },
        '&:hover': {
          color: colors.celigoAccent2,
          backgroundColor: 'inherit',
        },
        '&:disabled': {
          color: colors.celigoNeutral4,
        },
      },
    },
    MuiToolbar: {
      dense: {
        minHeight: appBarHeight,
      },
    },
    MuiToggleButtonGroup: {
      root: {
        backgroundColor: colors.celigoNeutral3,
      },
    },
    MuiToggleButton: {
      label: {
        color: colors.celigoNeutral8,
        '& .MuiTypography-root': {
          color: colors.celigoNeutral8,
        },
      },
    },
    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    MuiFormHelperText: {
      contained: {
        marginLeft: 0,
        marginBottom: 8,
      },
    },
    MuiMenu: {
      list: {
        maxHeight: 300,
      },
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: colors.celigoNeutral7,
        fontFamily: 'source sans pro',
        fontSize: 13,
        color: colors.celigoWhite,
        border: '1px solid',
        borderColor: colors.celigoNeutral7,
        padding: [[6, 8, 4, 8]],
        margin: '0px !important',
      },
    },
    MuiPickersDay: {
      day: {
        borderRadius: 4,
      },
    },
    MuiPickersClock: {
      container: {
        marginTop: 0,
      },
      clock: {
        backgroundColor: colors.celigoNeutral2,
      },
    },
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: colors.celigoWhite,
        height: 64,
      },
    },
    MuiPickersTimePickerToolbar: {
      toolbarAmpmLeftPadding: {
        paddingLeft: 24,
      },
    },
    MuiPickersToolbarText: {
      toolbarTxt: {
        color: colors.celigoNeutral4,
        fontSize: 48,
      },
      toolbarBtnSelected: {
        color: colors.celigoNeutral8,
      },
    },

    MuiMenuItem: {
      root: {
        minHeight: 38,
        fontSize: 'unset',
        // when there is a long name it is hiding the text
        whiteSpace: 'normal',
        borderBottom: `1px solid ${colors.celigoNeutral3}`,
        '&$selected': {
          backgroundColor: colors.celigoNeutral2,
          '&:before': {
            background: colors.celigoAccent3,
          },
          '&:hover': {
            backgroundColor: colors.celigoNeutral2,
          },
        },
        '&:last-child': {
          borderBottom: 'none',
        },
        '&:hover': {
          background: colors.celigoNeutral2,
          '&:before': {
            background: colors.celigoAccent3,
          },
        },
        '&:before': {
          content: '""',
          width: '6px',
          height: '100%',
          position: 'absolute',
          background: 'transparent',
          left: '0px',
        },
        '& > svg': {
          paddingRight: 8,
          fontSize: '1.8rem',
        },
      },
    },
    MuiTypography: {
      root: {
        color: colors.celigoNeutral8,
        fontFamily: 'Roboto400, sans-serif',
      },
      body1: {
        fontSize: '17px',
        lineHeight: '22px',
        letterSpacing: 'normal',
        fontFamily: 'source sans pro',
      },
      body2: {
        fontSize: '16px',
        lineHeight: '20px',
        letterSpacing: 'normal',
        fontFamily: 'source sans pro',
      },
      h1: {
        fontSize: '48px',
        fontFamily: 'Roboto300',
        lineHeight: '53px',
        letterSpacing: '-0.7px',
      },
      h2: {
        fontSize: '36px',
        fontFamily: 'Roboto300',
        lineHeight: '40px',
        letterSpacing: '-0.5px',
      },
      h3: {
        fontSize: '24px',
        fontFamily: 'Roboto300',
        lineHeight: '28px',
        letterSpacing: 'normal',
      },
      h4: {
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: 'normal',
        fontFamily: 'source sans pro semibold',
        fontWeight: 'normal',
      },
      h5: {
        fontSize: '17px',
        lineHeight: '22px',
        letterSpacing: 'normal',
      },
      h6: {
        fontSize: '15px',
        lineHeight: '18px',
        letterSpacing: 'normal',
        fontFamily: 'Roboto500',
      },
      subtitle1: {
        fontSize: '18px',
        lineHeight: '23px',
        letterSpacing: 'normal',
      },
      subtitle2: {
        fontSize: '14px',
        lineHeight: '18px',
        letterSpacing: 'normal',
        fontWeight: 'normal',
      },
      overline: {
        fontFamily: 'source sans pro',
        fontSize: '14px',
        lineHeight: '16px',
        letterSpacing: 0.5,
        fontWeight: '700',
      },
      caption: {
        fontFamily: 'Roboto400',
        fontSize: '0.75rem',
      },
    },
    MuiListItem: {
      root: {
        paddingBottom: 5,
        paddingTop: 5,
      },
      button: {
        '&:hover': {
          backgroundColor: colors.celigoNeutral1,
        },
      },
    },
    MuiListItemText: {
      root: {
        flex: 'unset',
        marginRight: 16,
      },
    },
    MuiTableRow: {
      root: {
        background: colors.celigoWhite,
        position: 'relative',
        '&:hover': {
          '&:hover': {
            background: colors.celigoNeutral2,
          },
        },
      },
      head: {
        '&:hover': {
          background: 'white !important',
        },
      },
    },
    MuiTableCell: {
      root: {
        position: 'relative',
        padding: 20,
        borderBottomColor: colors.celigoNeutral3,
        verticalAlign: 'top',
      },
      head: {
        fontFamily: 'source sans pro semibold',
        color: colors.celigoNeutral8,
        fontSize: 16,
      },
      body: {
        fontFamily: 'source sans pro',
        position: 'relative',
        fontSize: 16,
      },
    },
    MuiSelect: {
      icon: {
        color: colors.celigoNeutral8,
      },
      select: {
        '&:focus': {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiInput: {
      formControl: {
        background: colors.celigoWhite,
      },
      underline: {
        '&:before': {
          display: 'none',
        },
        '&:after': {
          display: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        border: '1px solid',
        borderColor: colors.celigoNeutral3,
        backgroundColor: colors.celigoWhite,
        '&:hover': {
          borderColor: colors.celigoAccent2,
        },
      },
      notchedOutline: {
        border: `${colors.celigoNeutral3} !important`,
      },
    },
    MuiFormLabel: {
      root: {
        fontFamily: 'source sans pro',
        fontSize: 14,
        lineHeight: '24px',
        color: colors.celigoNeutral8,
        '&.Mui-required': {
          fontFamily: 'source sans pro semibold',
        },
      },
    },
    MuiFilledInput: {
      root: {
        background: colors.celigoWhite,
        '&:hover': {
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent2,
        },
        '&$focused': {
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent2,
        },
        '&.Mui-disabled': {
          backgroundColor: colors.celigoNeutral2,
          color: alpha(colors.celigoNeutral6, 0.8),

        },
      },
      input: {
        background: colors.celigoWhite,
        border: '1px solid',
        borderColor: colors.celigoNeutral3,
        height: 38,
        fontSize: 15,
        padding: '0px 15px',
        boxSizing: 'border-box',
        borderRadius: 2,
        '&:hover': {
          borderColor: colors.celigoAccent2,
        },
        '&:disabled': {
          backgroundColor: colors.celigoNeutral2,
          color: alpha(colors.celigoNeutral6, 0.8),
          '&:hover': {
            borderColor: colors.celigoNeutral3,
          },
        },
      },
      underline: {
        '&:before': {
          display: 'none',
        },
        '&:after': {
          display: 'none',
        },
      },
      multiline: {
        background: colors.celigoWhite,
        border: '1px solid',
        borderColor: colors.celigoNeutral3,
        borderRadius: 2,
        padding: [[6, 15]],
        minHeight: 38,
        // Todo(Azhar): until final mock forms-design
        lineHeight: '24px',
        '&:hover': {
          borderColor: colors.celigoAccent2,
        },
        '&:disabled': {
          backgroundColor: colors.celigoNeutral2,
          color: alpha(colors.celigoNeutral6, 0.8),
        },
      },
      inputMultiline: {
        border: 'none',
      },
      adornedStart: {
        paddingLeft: 0,
        background: 'none',
      },
      adornedEnd: {
        paddingRight: 0,
        background: 'none',
      },
      inputAdornedStart: {
        paddingLeft: 15,
      },
      inputAdornedEnd: {
        paddingRight: 30,
      },
    },
    MuiTextField: {
      root: {
        background: colors.celigoWhite,
        '&:hover': {
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent2,
        },
        '&$focused': {
          backgroundColor: colors.celigoWhite,
          borderColor: colors.celigoAccent2,
        },
        '&.Mui-disabled': {
          backgroundColor: colors.celigoNeutral2,
          color: alpha(colors.celigoNeutral6, 0.8),
        },
      },
    },
    MuiInputAdornment: {
      root: {
        height: '100%',
      },
      positionEnd: {
        whiteSpace: 'nowrap',
      },
      positionStart: {
        whiteSpace: 'nowrap',
      },
    },
    MuiRadio: {
      root: {
        color: colors.celigoNeutral5,
        padding: 0,
        marginRight: 4,
        height: 20,
        '& svg': {
          fontSize: 18,
        },
        '&:hover': {
          background: 'none',
          color: colors.celigoAccent2,
        },
      },
    },
    MuiInputBase: {
      root: {
        fontFamily: 'source sans pro',
        fontSize: '15px',
        '&$disabled': {
          backgroundColor: colors.celigoNeutral2,
          borderColor: `${colors.celigoNeutral3} !important`,
          color: alpha(colors.celigoNeutral6, 0.8),
          '& >.MuiSelect-icon': {
            display: 'none',
          },
        },
      },
    },
    MuiIconButton: {
      root: {
        color: colors.celigoNeutral6,
        '&: disabled': {
          cursor: 'not-allowed',
        },
        '&:hover': {
          backgroundColor: colors.celigoNeutral2,
        },
      },
      label: {
        width: 24,
        height: 24,
        '& > span': {
          height: 28,
        },
      },
    },
    MuiDialogTitle: {
      root: {
        borderBottom: `1px solid ${colors.celigoNeutral3}`,
      },
    },
    MuiDialogContent: {
      root: {
        background: colors.celigoNeutral1,
      },
    },
    MuiChip: {
      root: {
        backgroundColor: colors.celigoWhite,
        color: colors.celigoNeutral6,
        border: '1px solid',
        borderColor: colors.celigoNeutral3,
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: alpha(colors.celigoNeutral6, 0.7),
      },
    },
    MuiFormGroup: {
      root: {
        flexDirection: 'row',
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: colors.celigoNeutral3,
      },
    },
    MuiCheckbox: {
      root: {
        color: colors.celigoNeutral5,
        padding: 0,
        borderRadius: 0,
        '& svg': {
          fontSize: 20,
        },
        '&:hover': {
          background: 'none',
          color: colors.celigoAccent2,
        },
      },
      colorPrimary: {
        '&.Mui-disabled': {
          color: colors.celigoNeutral3,
        },
      },
    },
    MuiTabs: {
      root: {
        minHeight: 36,

      },
      scrollButtonsDesktop: {
        '& > svg': {
          border: '1px solid',
          borderColor: colors.celigoNeutral3,
        },
      },
    },
    MuiListSubheader: {
      gutters: {
        fontFamily: 'Roboto500',
      },
    },
    MuiDrawer: {
      paper: {
        background: colors.celigoNeutral1,
      },
    },
    MuiTab: {
      root: {
        minHeight: 36,
        minWidth: 140,
        padding: '8px 12px 4px',
        textTransform: 'none',
        fontFamily: 'source sans pro',
        fontWeight: 'normal',
      },
      textColorPrimary: {
        color: colors.celigoNeutral8,
        '&.Mui-selected': {
          fontFamily: 'source sans pro semibold',
        },
      },
      labelIcon: {
        minHeight: 'unset',
      },
      wrapper: {
        fontSize: 14,
        '& > svg': {
          fontSize: '1.1rem',
        },
        flexDirection: 'row',
        '& > *:first-child': {
          marginBottom: '0 !important',
          marginRight: 4,
        },
      },
    },
    MuiFormControlLabel: {
      root: {
        marginLeft: 0,
        marginRight: 24,
      },
      label: {
        fontSize: 14,
        lineHeight: '18px',
      },
    },
    MuiSnackbar: {
      root: {
        maxWidth: 700,
      },
    },
    // Please note that the info|error|success|warn variant styles are configured in the <SnackbarProvider>
    // component used in the application's root component.
    MuiSnackbarContent: {
      action: {
        color: colors.celigoNeutral8,
      },
      message: {
        overflow: 'auto',
        maxHeight: 300,
        color: colors.celigoNeutral8,
        '& svg': {
          fontSize: '32px !important',
        },
      },
      root: {
        borderRadius: 6,
        flexWrap: 'nowrap',
        flexGrow: '1 !important',
        backgroundColor: colors.celigoWhite,
        '&:before': {
          borderTopLeftRadius: 6,
          borderBottomLeftRadius: 6,
          content: '""',
          width: 5,
          height: '100%',
          position: 'absolute',
          background: colors.celigoNeutral3,
          left: 0,
          top: 0,
        },
      },
    },
    MuiAccordion: {
      root: {
        borderRadius: '4px',
        padding: '1px 0px',
        '&:before': {
          backgroundColor: 'none',
        },
      },
    },
    MuiAccordionSummary: {
      root: {
        flexDirection: 'row-reverse',
        display: 'inline-flex',
        minHeight: 'unset',
        '&.Mui-expanded': {
          minHeight: '40px',

        },
      },
      expandIcon: {
        padding: 0,
        margin: [[1, 4, 0, 0]],
      },

      content: {
        margin: [[10, 0, 10, 0]],
        '&.Mui-expanded': {
          margin: [[10, 0, 10, 0]],
        },
      },
    },
    MuiAccordionDetails: {
      root: {
        paddingBottom: 0,
        borderTop: `1px solid ${colors.celigoNeutral3}`,
      },
    },
    MuiAutocomplete: {
      option: {
        position: 'relative',
        fontSize: '14px',
        alignItems: 'flex-start',
        borderBottom: `1px solid ${colors.celigoNeutral3}`,
        '&:before': {
          content: '""',
          width: '6px',
          height: '100%',
          position: 'absolute',
          background: 'transparent',
          left: 0,
          top: 0,
        },
        '&[data-focus="true"]': {
          backgroundColor: colors.celigoNeutral2,
          '&:before': {
            background: colors.celigoAccent3,
          },
        },
        '&:active': {
          backgroundColor: colors.celigoNeutral2,
        },
      },
      inputRoot: {
        alignItems: 'flex-start',
      },
      listbox: {
        padding: '2px 0px',
      },
    },

  },
  props: {
    MuiCheckbox: {
      disableRipple: true,
      color: 'primary',
    },
    MuiButton: {
      'data-public': true,
      disableElevation: true,
    },
    MuiFormLabel: {
      'data-public': true,
    },
    MuiExpansionPanelSummary: {
      'data-public': true,
    },
    MuiTooltip: {
      'data-public': true,
      arrow: true,
    },
    MuiTabs: {
      'data-public': true,
    },
    MuiCard: {
      'data-public': true,
    },
    MuiDialogTitle: {
      'data-public': true,
    },
    MuiDialogContent: {
      'data-public': true,
    },
    MuiTablePagination: {
      'data-public': true,
    },
    MuiSnackbarContent: {
      'data-public': true,
    },
    MuiMenuItem: {
      'data-public': true,
    },
  },
};

