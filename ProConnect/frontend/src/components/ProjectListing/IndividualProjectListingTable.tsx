import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  useMediaQuery,
  TableFooter,
  IconButton,
  useTheme,
  styled,
  tableCellClasses,
} from '@mui/material';
import React, { useState } from 'react';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { ClipLoader } from 'react-spinners';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

/**
 * A table component that displays a list of projects.
 * @param {string} tableName - The name of the table.
 * @param {string[]} headers - An array of strings representing the table headers.
 * @param {any[]} dataRows - An array of objects representing the data rows of the table.
 * @param {boolean} loading - A boolean indicating whether the table is currently loading data.
 * @returns {JSX.Element} - A React component that displays the table.
 */
const IndividualProjectListingTable = (props: {
  tableName: string;
  headers: string[];
  dataRows: any[];
  loading: boolean;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="My Project Table">
        {!isMobile && (
          <TableHead>
            <TableRow>
              <StyledTableCell key={props.headers[0]}>
                <strong>{props.headers[0]}</strong>
              </StyledTableCell>
              {props.headers.slice(1).map((header) => (
                <StyledTableCell key={header} align="right">
                  <strong>{header}</strong>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {props.loading ? (
            <TableRow>
              <TableCell colSpan={props.headers.length} align="center">
                <ClipLoader color={theme.palette.secondary.main} />
              </TableCell>
            </TableRow>
          ) : (
            <>
              {props.dataRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={props.headers.length} align="center">
                    No {props.tableName.toLowerCase()} available
                  </TableCell>
                </TableRow>
              ) : (
                (rowsPerPage > 0
                  ? props.dataRows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : props.dataRows
                ).map((row) => (
                  <StyledTableRow
                    id={row['id'] + 'notMobile'}
                    key={row['id'] + 'notMobile'}
                  >
                    {!isMobile && (
                      <>
                        <StyledTableCell component="th" scope="row">
                          {row[props.headers[0].toLowerCase()]}
                        </StyledTableCell>

                        {props.headers.slice(1).map((header) => (
                          <StyledTableCell key={header} align="right">
                            {row[header.replace(' ', '_').toLowerCase()]}
                          </StyledTableCell>
                        ))}
                      </>
                    )}

                    {isMobile && (
                      <StyledTableCell
                        component={'th'}
                        scope={'row'}
                        id={row.id + 'mobile'}
                        key={row.id + 'mobile'}
                      >
                        <Grid container spacing={2}>
                          {props.headers.map((header) => (
                            <Grid item xs={12} key={header}>
                              <strong>
                                {header}:{' '}
                                {row[header.replace(' ', '_').toLowerCase()]}
                              </strong>
                            </Grid>
                          ))}
                        </Grid>
                      </StyledTableCell>
                    )}
                  </StyledTableRow>
                ))
              )}
            </>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[15, 30, 50, { label: 'All', value: -1 }]}
              colSpan={props.headers.length}
              count={props.dataRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
              sx={
                isMobile
                  ? {
                      '& .MuiTablePagination-input': { mr: 1 },
                    }
                  : {}
              }
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={isMobile ? { flexShrink: 0, ml: 1 } : { flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        size="small"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        size="small"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        size="small"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        size="small"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default IndividualProjectListingTable;
