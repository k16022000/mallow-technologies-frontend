/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { ArrowCircleLeft, ArrowCircleRight, Search } from '@mui/icons-material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useLocation } from "react-router";
import {
  FormField,
  SelectionField,
} from './CustomFormComponents';
import xl from '../../assets/xl.svg';
import CustomFormik from './Customformik';
import TableLoader from './TableLoader';
import styles from './styles/CustomDataTable.module.scss';

interface Column {
  content: string;
  accessor: string;
  width?: string;
  align?: 'left' | 'center' | 'right' | undefined;
}

interface TableData {
  columns: Column[];
  rows: Record<string, unknown>[];
}

interface CustomDataTableProps {
  searchable?: boolean;
  customizableEntriesCount?: boolean;
  tableData?: TableData | undefined;
  handleDataRefresh?: (
    searchString: string,
    entriesPerPage: number,
    currentPage: number,
    filterBy: string,
  ) => void;
  totalCount?: number;
  pagination?: boolean;
  searchDebounceTimeout?: number;
  forceRender?: unknown;
  keyIndex?: number;
  keyName?: string;
  entryOptions?: number[];
  searchIgnoredColumns?: string[];
  tableReplacement?: React.ReactNode | null;
  ignorePaginationCache?: boolean;
  paginationCacheKey?: string;
  nullDataText?: string;
  isXlDownload?: boolean;
  excelContent?: string;
  onExcelUpload?: (file: File) => void;
  downloadExcel?: (rows: Record<string, unknown>[]) => void;
  tableTitle?: string;
  addUserLabel?: string;
  onAdd: () => void;
  toggleView: (newView: string) => void;
  onSearch: (value: string) => void;
  view?: string;
}

interface State {
  searchString: string | null;
  entriesPerPage: number | null;
  currentPage: number;
  filterBy: string;
  isTableLoading: boolean;
  scrollAmount: number;
}

const CustomDataTable: React.FC<CustomDataTableProps> = (props) => {
  const {
    searchable = false,
    customizableEntriesCount = false,
    tableData = { columns: [], rows: [] },
    handleDataRefresh = () => { },
    totalCount = 0,
    pagination = true,
    searchDebounceTimeout = 1000,
    forceRender,
    keyIndex = 0,
    keyName,
    entryOptions = [5, 10, 20, 50],
    tableReplacement = null,
    ignorePaginationCache = false,
    paginationCacheKey = '',
    nullDataText = 'No Data Found',
    isXlDownload = false,
    excelContent = "XL Download",
    onExcelUpload = () => { },
    downloadExcel = () => { },
    onAdd = () => { },
    toggleView = () => { },
    onSearch = () => { },
    tableTitle,
    addUserLabel,
    view,
  } = props;

  const location = useLocation();
  const initialProps = JSON.parse(
    ignorePaginationCache
      ? '{}'
      : sessionStorage.getItem(`paginationProps-${paginationCacheKey}${location.pathname}`) || '{}'
  ) as Partial<State>;
  const inputRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<State>({
    searchString: null,
    entriesPerPage: null,
    currentPage: 1,
    filterBy: '',
    isTableLoading: true,
    scrollAmount: 100,
  });
  const {
    searchString,
    entriesPerPage,
    currentPage,
    filterBy,
    isTableLoading,
    scrollAmount,
  } = state;

  const [debouncedSearchString, setDebouncedSearchString] = useState<string | null>(searchString);

  const { columns = [], rows = [] } = tableData;

  const [scrollState, setScrollState] = useState<[boolean, boolean]>([true, false]);
  const [isLeftScrollButtonDisabled, isrightScrollButtonDisabled] = scrollState;

  const setEntriesPerPage = (e: { target: { name: string; value: any } }) => {
    setState(prev => ({
      ...prev,
      entriesPerPage: e.target.value,
    }));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      searchString: event.target.value,
    }));
    onSearch(event.target.value);
  };

  const handlePaginationChange = (_event: React.ChangeEvent<unknown>, targetPage: number) => {
    setState(prev => ({
      ...prev,
      currentPage: targetPage,
    }));
  };

  const showHeader = useMemo(
    () => customizableEntriesCount || searchable,
    [customizableEntriesCount, searchable]
  );

  // useEffect(() => {
  //   if (inputRef.current) {
  //     const inputElement = inputRef.current.querySelector('input');
  //     if (inputElement) {
  //       inputElement.focus();
  //     }
  //   }

  //   setState(prev => ({
  //     ...prev,
  //     isTableLoading: entriesPerPage !== null ? false : prev.isTableLoading,
  //   }));

  //   if (currentPage && currentPage > 0 && totalCount !== 0 && rows.length === 0) {
  //     setState(prev => ({
  //       ...prev,
  //       currentPage: Math.max(Math.ceil(totalCount / (entriesPerPage || 1)), 1),
  //     }));
  //   }
  // }, [tableData, totalCount, currentPage]);

  useEffect(() => {
    if (inputRef.current) {
      const inputElement = inputRef.current.querySelector('input');
      if (inputElement) {
        inputElement.focus();
      }
    }

    setState(prev => ({
      ...prev,
      isTableLoading: entriesPerPage !== null ? false : prev.isTableLoading,
    }));
  }, [tableData, totalCount]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchString(searchString);
    }, searchDebounceTimeout);

    return () => clearTimeout(handler);
  }, [searchString, searchDebounceTimeout]);

  useEffect(() => {
    const saveableProps = { ...state };
    sessionStorage.setItem(
      `paginationProps-${paginationCacheKey}${location.pathname}`,
      JSON.stringify(saveableProps)
    );
    setState(prev => ({ ...prev, isTableLoading: true }));

    if (entriesPerPage && entriesPerPage > 0) {
      handleDataRefresh(
        // debouncedSearchString,
        entriesPerPage,
        currentPage,
        filterBy,
      );
    }
  }, [entriesPerPage, currentPage, forceRender]);
  // }, [debouncedSearchString, entriesPerPage, currentPage, forceRender]);

  useEffect(() => {
    const {
      entriesPerPage: initialEntriesPerPage,
      currentPage: initialPage,
      searchString: initialSearchString,
    } = initialProps;

    setState(prev => ({
      ...prev,
      searchString: initialSearchString ?? '',
      entriesPerPage: initialEntriesPerPage && entryOptions.includes(initialEntriesPerPage)
        ? initialEntriesPerPage
        : entryOptions[0],
      currentPage: initialPage ?? 1,
    }));
    setDebouncedSearchString(initialSearchString || '');
  }, []);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const isLeftDisabled = container.scrollLeft <= 0;
    const isRightDisabled = container.scrollLeft + container.offsetWidth >= container.scrollWidth;

    setScrollState([isLeftDisabled, isRightDisabled]);
  };

  useEffect(() => {
    const scrollElement = containerRef.current;
    if (scrollElement) scrollElement.addEventListener('scroll', handleScroll);
    if (scrollElement?.offsetWidth) {
      setState(prev => ({ ...prev, scrollAmount: (scrollElement?.offsetWidth || 200) / 0.75 }));
    }

    return () => {
      if (scrollElement) scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [tableData]);

  const isScrollButtonsRequired = (e = containerRef.current) => {
    if (e) {
      const containerWidth = e?.offsetWidth;
      const childWidth = e?.children[e?.children?.length - 1]?.scrollWidth;
      if (containerWidth && childWidth) return childWidth > containerWidth;
    }
    return false;
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: containerRef.current.scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: containerRef.current.scrollLeft - scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getRowKey = (row: { [x: string]: unknown }) => {
    const keys = Object.keys(row);
    const safeIndex = Math.max(Math.min(keyIndex, keys.length - 1), 0);
    return row[keyName || keys[safeIndex]];
  };

  const getRowIndex = (index: number) => {
    return entriesPerPage && currentPage
      ? entriesPerPage * (currentPage - 1) + index + 1
      : index + 1;
  };

  return (
    <TableContainer className={styles.tableContainer}>
      {/* {showHeader && (
        <Grid container className={styles.headerContainer}>
          {searchable ? (
            <Box className={styles.searchBox}>
              <CustomFormik initialValues={{}} onSubmit={() => { }}>
                {({ handleBlur }: { handleBlur: (e: React.FocusEvent) => void }) => (
                  <FormField
                    name="planned_hours"
                    placeholder="Type to Search..."
                    size="small"
                    onChange={handleSearch}
                    onBlur={handleBlur}
                    value={searchString || ''}
                    success={searchString !== ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" className={styles.search} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </CustomFormik>
            </Box>
          ) : (
            <div />
          )}

          {customizableEntriesCount ? (
            <Box className={styles.controlsBox}>
              {isScrollButtonsRequired() && (
                <div className={styles.scrollButtonContainer}>
                  <ArrowCircleLeft
                    className={isLeftScrollButtonDisabled ? styles.disabledScrollButton : ''}
                    onClick={scrollLeft}
                  />
                  <ArrowCircleRight
                    className={isrightScrollButtonDisabled ? styles.disabledScrollButton : ''}
                    onClick={scrollRight}
                  />
                </div>
              )}
              {isXlDownload &&
                (excelContent === "Excel Upload" ? (
                  <>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      style={{ display: "none" }}
                      id="excel-upload-input"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          onExcelUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <Tooltip title={excelContent} arrow>
                      <Box
                        component="img"
                        src={xl}
                        alt="Excel Icon"
                        className={styles.excelIcon}
                        onClick={() => {
                          const input =
                            document.getElementById("excel-upload-input");
                          if (input) input.click();
                        }}
                      />
                    </Tooltip>
                  </>
                ) : (
                  <Tooltip title={excelContent} arrow>
                    <Box
                      component="img"
                      onClick={() => downloadExcel(rows)}
                      src={xl}
                      alt="Excel Icon"
                      className={styles.excelIcon}
                    />
                  </Tooltip>
                ))}

              <div className={styles.entriesDropdown}>
                <SelectionField
                  name=""
                  size="small"
                  value={entriesPerPage}
                  options={entryOptions.map((entry) => ({
                    key: entry,
                    value: entry,
                    label: entry.toString(),
                  }))}
                  onChange={setEntriesPerPage}
                  placeholder="Select entries per page"
                />
              </div>
            </Box>
          ) : (
            <div />
          )}
        </Grid>
      )} */}


      {showHeader && (
        <Grid container className={styles.headerContainer} alignItems="center" justifyContent="space-between">
          <Grid className={styles.tableTitle}>
            <Typography variant="h5" gutterBottom>{tableTitle}</Typography>
          </Grid>

          <Grid className={styles.rightControls}>
            <Box className={styles.searchBox}>
              {searchable && (
                <CustomFormik initialValues={{}} onSubmit={() => { }}>
                  {({ handleBlur }: { handleBlur: (e: React.FocusEvent) => void }) => (
                    <FormField
                      name="planned_hours"
                      placeholder="Type to Search..."
                      size="small"
                      onChange={handleSearch}
                      onBlur={handleBlur}
                      value={searchString || ''}
                      success={searchString !== ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search fontSize="small" className={styles.search} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </CustomFormik>
              )}
            </Box>

            <Box>
              <Button className={styles.addButton} onClick={onAdd}>
                {addUserLabel}
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      <div className={styles.titleActions}>
        <ToggleButtonGroup
          exclusive
          color="info"
          className={styles.toggleGroup}
          value={view}
          onChange={(_, newView) => toggleView(newView)}
          aria-label="view type"
        >
          <ToggleButton value="list" aria-label="Table View">
            <ViewListIcon fontSize="small" style={{ marginRight: 4 }} />
            Table
          </ToggleButton>
          <ToggleButton value="cards" aria-label="Card View">
            <ViewModuleIcon fontSize="small" style={{ marginRight: 4 }} />
            Card
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {tableReplacement || (
        <Box
          sx={{ maxWidth: '100%', overflow: 'auto' }}
          className="custom-data-table"
          ref={containerRef}
        >
          <Table>
            <Box bgcolor="#fafafa" color="#08152e" component="thead">
              <TableRow>
                {/* <TableCell sx={{ fontWeight: 'bold' }} width="auto" align="center">
                  S. No.
                </TableCell> */}

                {columns.map((column: Column) => (
                  <React.Fragment key={column.accessor}>
                    {column ? (
                      <TableCell
                        sx={{
                          fontWeight: 'bold',
                        }}
                        width={column.width ? column.width : 'auto'}
                        align={column.align ? column.align : 'left'}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '.5em',
                            justifyContent: column.align || 'flex-start',
                          }}
                        >
                          <div>{column.content}</div>
                        </div>
                      </TableCell>
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                ))}
              </TableRow>
            </Box>

            {isTableLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <TableLoader columns={columns.length + 1} />
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              <TableBody>
                {rows.map((row: { [x: string]: unknown; id?: unknown }, index: number) => (
                  <TableRow key={getRowKey(row) as string}>
                    {/* <TableCell align="center" variant="body">
                      {getRowIndex(index)}
                    </TableCell> */}

                    {columns.map((column) => (
                      <React.Fragment key={column.accessor}>
                        {column ? (
                          <TableCell align={column.align || 'left'}>
                            {row[column.accessor] as React.ReactNode}
                          </TableCell>
                        ) : null}
                      </React.Fragment>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell variant="body" align="center" colSpan={columns.length + 1}>
                    {nullDataText}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </Box>
      )}

      {pagination && (
        <Grid
          container
          direction="row"
          sx={{
            justifyContent: 'end',
            alignItems: 'center',
            padding: '1rem',
          }}
        >
          {entriesPerPage && Math.ceil(totalCount / entriesPerPage) > 1 ? (
            <>
              <Pagination
                color="primary"
                count={Math.ceil(totalCount / 6)}
                page={currentPage}
                onChange={handlePaginationChange}
              />
              {/* <Typography variant="h6">
                Showing {entriesPerPage && currentPage ? entriesPerPage * (currentPage - 1) + 1 : 1} to{' '}
                {entriesPerPage && currentPage
                  ? Math.min(entriesPerPage * currentPage, totalCount)
                  : Math.min(rows.length, totalCount)}{' '}
                of {totalCount}
              </Typography> */}
            </>
          ) : (
            <>
              <div />
              <Typography variant="h6">-- End of the list --</Typography>
              <div />
            </>
          )}
        </Grid>
      )}
    </TableContainer>
  );
};

export default CustomDataTable;
