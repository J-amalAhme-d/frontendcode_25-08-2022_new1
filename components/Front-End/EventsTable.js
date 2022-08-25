import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import FilterListIcon from '@mui/icons-material/FilterList';

import { visuallyHidden } from '@mui/utils';
import UserUtils from "../src/utils/UserUtils";
import APICaller from "../api/APICaller";
import { useEffect, useState } from 'react';
import Router from 'next/router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StorageUtils from '../src/utils/StorageUtils';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


//EVENTS TABLE HEADS 
const headCells = [
  {
    id: 'title',
    numeric: false,
    disablePadding: false,
    label: 'Event Title',
    alignRight:false,
  },
  {
    id: 'sport',
    numeric: true,
    disablePadding: false,
    label: 'Sport',
    alignRight: true,
  },
  {
    id: 'event_from_date',
    numeric: true,
    disablePadding: false,
    label: 'From Date',
    alignRight: true,
  },
  {
    id: 'event_to_date',
    numeric: true,
    disablePadding: false,
    label: 'To Date',
    alignRight: true,
  },
  {
    id: 'organization',
    numeric: true,
    disablePadding: false,
    label: 'Organization',
    alignRight: true,
  },
  {
    id: 'state',
    numeric: true,
    disablePadding: false,
    label: 'State',
    alignRight: true,
  },
  {
    id: 'city',
    numeric: true,
    disablePadding: false,
    label: 'City',
    alignRight: true,
  },
  // {
  //   id: 'slots',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Slots',
  // },
  {
    id:"action",
    numeric: false,
    disablePadding: false,
    label: "Action",
    alignRight: true,
  },

];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, selected, isSupportEdit, isSupportRegister } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Events
        </Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EventsTable(props) {
  const {
    isSupportRegister,
    isSupportEdit
  } = props;

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [userId, setUserId] = useState(null);

  const [rows, setrows] = useState([]);

  //EVNETS TABLES RELATED HOOKS 
  useEffect(() => {
    UserUtils.getAuthenticatedUser() 
    .then(aUser => {
      console.log(aUser);
      APICaller.apiGetEvents(50, null)
        .then((response) => {
          console.log("events",response);
          setrows(response);
        })
        .catch(e => {
          console.error(e);
        })
    })
    .catch(e => {
      console.error("Coach is not probably not signed in",e);
    })

    //Load user id to state
    let usrId = StorageUtils.getLocalStorageObject('usid');
    setUserId(usrId);

    //Adding subscription for player event registration for autoincrement bib id for player
    const subscription = APICaller.onAPIAddPlayerEventRegistration();

    return () => {
      subscription.unsubscribe();
    }
  }, []);



  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleViewEvent = (eventId) => {
    Router.push({
      pathname:'/EventDetailsPage',
      query: {
        event_id:eventId
      }
    },'/EventDetailsPage');
  }

  const handleEditEvent = (eventId) => {
    Router.push({
      pathname:'/EventPage',
      query: {
        event_id:eventId
      }
    },'/EventPage');
  }

  const handleRegisterEvent = (tEvent) => {
    UserUtils.getAuthenticatedUser()
      .then(u => {
        //TODO - Register player after making payment
        APICaller.apiAddPlayerEventRegistration({
          playerRegistrationsId: userId,
          eventRegistrationsId: tEvent.id
          })
          .then(r => {
            console.log("Player Event Registration Complete",r);
            Router.push({
              pathname:'/EventPaymentPage',
              query: 
                {
                  type: 2,
                  product: tEvent.title,
                  currency: tEvent.player_registration_price_units,
                  quantity: 1,
                  product_id: (userId + ":" + tEvent.id),
                  unit_amount: tEvent.player_registration_price,
                  sender: userId,
                  receiver: "True Tryouts",
                  sport: tEvent.sport
                }
            },'/EventPaymentPage');
          })
          .catch(e => {
            console.error("Player Event Registration failed",e);
          })
      })
  }

  const handleEvaluateEvent = (eventId) => {
    Router.push({
      pathname:'/EvaluationsLandingPage',
      query: {
        event_id:eventId
      }
    },'/EvaluationsLandingPage');
  }
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          selected={selected}
          isSupportEdit={isSupportEdit}
          isSupportRegister={isSupportRegister}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      //onClick={(event) => handleClick(event, row.id)} //Removed Checkbox and Onclick of Row event handlers
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell> */}
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        align="left"
                      >
                        {row.title}
                      </TableCell>
                      <TableCell align="right">{row.sport}</TableCell>
                      <TableCell align="right">{row.event_from_date}</TableCell>
                      <TableCell align="right">{row.event_to_date}</TableCell>
                      <TableCell align="right">{row.organization}</TableCell>
                      <TableCell align="right">{row.state}</TableCell>
                      <TableCell align="right">{row.city}</TableCell>
                      {/* <TableCell align="right">{() => {
                        //TODO - get age groups somehow
                        if(row.slots !== null && row.slots.length > 0)
                          return JSON.stringify(row.slots);
                      }}</TableCell> */}
                      <TableCell align="right">
                        {/* <Link 
                          to={{
                            pathname: "/CoachEventDetailsPage",
                            state: { id: row.id }
                          }}>view
                        </Link> */}
                        {/* <Link href={`/CoachEventDetailsPage?id=${row.id}`}>view</Link> */}
                        <Tooltip title="View the event">
                        <IconButton onClick={() => {handleViewEvent(row.id);}}>
                          <VisibilityIcon/>
                        </IconButton>
                      </Tooltip>
                        { isSupportEdit && 
                          <Tooltip title="Edit the event">
                            <IconButton onClick={() => {handleEditEvent(row.id);}}>
                              <EditIcon/>
                            </IconButton>
                          </Tooltip>
                        }
                        {
                          isSupportRegister && 
                          <Tooltip title="Register for event">
                            <IconButton onClick={() => {handleRegisterEvent(row);}}>
                              <FollowTheSignsIcon />
                            </IconButton>
                          </Tooltip>
                        }
                        {
                          isSupportEdit && 
                          <Tooltip title="Evaluate the event players">
                            <IconButton onClick={() => {handleEvaluateEvent(row.id);}}>
                              <SportsScoreIcon />
                            </IconButton>
                          </Tooltip>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}