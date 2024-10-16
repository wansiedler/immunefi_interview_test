import * as React from "react";
import {useEffect, useState} from "react";
import {AxiosError} from "axios";
import {Box, FormHelperText, Snackbar, Typography,} from "@mui/material";
import moment from "moment/moment";

import {useRouter} from 'next/router';
import {
    DataGrid,
    gridClasses,
    GridColDef,
    GridPagination,
    GridRenderCellParams,
    GridSortDirection,
    GridSortModel
} from '@mui/x-data-grid';
import {GridRowModel} from "@mui/x-data-grid/models/gridRows";
import {styled} from '@mui/material/styles';
import {Project, Report, User} from "@prisma/client";
import {ErrorResponse, Meta, PopulatedReport, ReportFilters} from "@/pages/api/reports";
import Link from "next/link";
import {filterObjByNonEmptyKeyAndValues} from "@/utils/utils";
import {Filters, reportTypes} from "@/components/Filters/Filters";
import {fetchReports, fetchTotalReports} from "@/utils/API";


export type DashboardProps = {}
export default function Dashboard({}: DashboardProps) {
    const router = useRouter();
    const [totalReports, setTotalReports] = useState<number>(0);
    const [reports, setReports] = useState<PopulatedReport[]>([]);
    const [meta, setMeta] = useState<Meta>();
    const [filters, setFilters] = useState<ReportFilters>({});
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);


    useEffect(() => {
        fetchTotalReports(process.env.NEXT_PUBLIC_API_KEY ?? "WRONG_APIKEY").then(({totalReports}) => {
            setTotalReports(totalReports);
        }).catch((err) => {
            if (err instanceof AxiosError) {
                const errorResponse = err.response?.data as ErrorResponse;
                setError(errorResponse?.error || "An error occurred while fetching reports.");
            } else {
                setError("An unexpected error occurred.");
            }
            setOpenSnackbar(true);
        });
    }, []);

    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (debounceTimeout) clearTimeout(debounceTimeout);
        const timeout = setTimeout(() => {
            fetchReports(filters, process.env.NEXT_PUBLIC_API_KEY ?? "WRONG_APIKEY")
                .then(({reports, meta}) => {
                    setReports(reports);
                    setMeta(meta);
                    setError(null);
                })
                .catch((err) => {
                    if (err instanceof AxiosError) {
                        const errorResponse = err.response?.data as ErrorResponse;
                        setError(errorResponse?.error || "An error occurred while fetching reports.");
                    } else {
                        setError("An unexpected error occurred.");
                    }
                    setOpenSnackbar(true);
                });
        }, 300);
        setDebounceTimeout(timeout);
        return () => clearTimeout(timeout);
    }, [filters,]);

    const updateURLParams = (newFilters: Partial<ReportFilters>) => {
        router.push({
            pathname: '/',
            query: newFilters,
        }, undefined, {shallow: true});
    };

    const handleFilterChange = (newFilters: Partial<ReportFilters>) => {
        newFilters = filterObjByNonEmptyKeyAndValues({
            ...filters,
            ...newFilters,
        })
        setFilters(newFilters);
        updateURLParams(newFilters);
    };

    const columns: GridColDef[] = [
            {
                field: 'id', headerName: 'ID',
                renderCell: (row) => (
                    <Link href={`/reports/${row.row.id}`} passHref style={{
                        color: "black",
                        textDecoration: "none",
                    }}>
                        <Typography variant={"button"} style={{
                            fontWeight: 1000,
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            borderRadius: "5px",
                            backgroundColor: "white",
                            padding: "10px",
                            color: "black",
                            textDecoration: "none",
                        }}>
                            #{row.row.id}
                        </Typography>
                    </Link>
                )
            },
            {
                field: 'project',
                headerName: 'Project',
                valueGetter: (row: GridRowModel<Project>) => row.name,
                minWidth: 100,
                flex: 1
            },
            {
                field: 'user',
                headerName: 'Hacker',
                valueGetter: (row: GridRowModel<User>) => row.email,
                minWidth: 100,
                flex: 1
            },
            {
                field: 'type',
                headerName: 'Type',
                valueGetter: (row: string) => reportTypes[row],
                minWidth: 100,
                flex: 1
            },
            {
                field: 'severity', headerName: 'Severity',
                minWidth: 100,
                // flex: 1,
                renderCell: (row: GridRenderCellParams<Report>) => {
                    return <div>
                        <span style={{
                            opacity: "0.5",
                            backgroundColor: row.row.severity === "none" ? "grey" : row.row.severity === "low" ? "green" : row.row.severity === "medium" ? "blue" : row.row.severity === "high" ? "orange" : "red",
                            fontWeight: 1000,
                            margin: "1px auto",
                            textAlign: "center",
                            display: "block",
                            borderRadius: "5px",
                            height: "50%",
                            color: "#ccc",
                        }}>{row.row.severity}
                        </span>
                    </div>
                },
            },
            {
                field: 'status', headerName: 'Status',
                minWidth: 100,
                // flex: 1
            },
            {
                field: 'createdAt',
                headerName: 'Submission Date',
                // valueGetter: (row: GridRowModel) => new Date(row.toString()).toLocaleDateString(), //minWidth: 100,flex: 1
                minWidth: 100, flex: 1,
                sortable: true,
                valueGetter: (row: GridRowModel<Report>) => {
                    return new Date(row.createdAt);
                },
                renderCell: (row: GridRenderCellParams<Report>) => {
                    return <>{moment(row.row.createdAt).format("HH:mm DD.MM.YY")}</>
                },

            }
        ]
    ;

    const StripedDataGrid = styled(DataGrid)(({theme}) => ({
        backgroundColor: "#EEF2FF",
        [`& .${gridClasses.row}.even`]: {
            backgroundColor: theme.palette.grey[200],
        },
        [`& .${gridClasses.row}`]: {
            height: "1em",
            '&:hover': {
                backgroundColor: theme.palette.primary.main,
                '@media (hover: none)': {
                    backgroundColor: 'transparent',
                },
            },
            '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    '@media (hover: none)': {backgroundColor: theme.palette.primary.main,},
                },
            },
        },
    }));

    return (
        <Box style={{height: '100%', width: '95%', margin: "0 auto"}}>
            <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => {
                setOpenSnackbar(false);
            }} message={error}/>
            <Typography variant="h4" component="h1" gutterBottom>
                Reports
            </Typography>

            <Filters filters={filters} setFilters={setFilters} handleFilterChange={handleFilterChange}/>
            <StripedDataGrid
                rows={reports}
                getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
                columns={columns}
                paginationModel={{
                    pageSize: filters.pageSize ?? 10, page: filters.page ?? 0,
                }}
                onPaginationModelChange={(paginationModel) => {
                    handleFilterChange({...paginationModel});
                }}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                paginationMode="server"
                rowCount={(meta?.totalPages && meta.totalPages) ?? 100}
                loading={!reports.length}
                getRowId={(row) => row.id}
                slots={{
                    pagination: () => (<> <span style={{
                        fontWeight: 1000,
                    }}>Total found: {meta?.foundReports}</span> {<GridPagination/>}    </>),
                }}
                sortModel={[{
                    field: filters.field ?? 'createdAt',
                    sort: filters.sort as GridSortDirection ?? 'desc'
                }]}
                onSortModelChange={(sortModel: GridSortModel) => {
                    handleFilterChange({field: sortModel[0]?.field, sort: sortModel[0]?.sort ?? "asc",});
                }}
            />
            <FormHelperText>Total reports {totalReports}</FormHelperText>
        </Box>
    );
}
