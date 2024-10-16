import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Tab, Tabs, TextField,} from "@mui/material";
import * as React from "react";
import {SyntheticEvent, useEffect, useState} from "react";
import {ReportSeverity, ReportStatus, ReportType} from "@prisma/client";
import {ReportFilters} from "@/pages/api/reports";
import {useRouter} from "next/router";

const severities = ["critical", "high", "medium", "low", "none"];

export const reportStatuses: Record<string, string>[] = [
    {value: "all", label: "All"},
    {value: "reported", label: "Reported"},
    {value: "escalated", label: "Escalated"},
    {value: "confirmed", label: "Confirmed"},
    {value: "paid", label: "Paid"},
    {value: "closed", label: "Closed"},
];

export const reportTypes: Record<string, string> = {
    blockchain_dlt: "Blockchain/DLT",
    smart_contract: "Smart Contract",
    websites_and_applications: "Websites and Applications",
};

export const Filters = ({
                            filters,
                            setFilters,
                            handleFilterChange,
                        }: {
    filters: ReportFilters;
    setFilters: React.Dispatch<React.SetStateAction<ReportFilters>>;
    handleFilterChange: (filters: ReportFilters) => void;
}) => {
    const [currentTab, setCurrentTab] = useState<number>(0);
    const [reportId, setReportId] = useState<number | undefined>();
    const [project, setProject] = useState<string>();
    const [severity, setSeverity] = useState<ReportSeverity>();
    const [hacker, setHacker] = useState<string>();
    const [type, setType] = useState<ReportType>();

    const router = useRouter();

    useEffect(() => {
        const {
            status,
            reportId,
            project,
            severity,
            hacker,
            type,
            page,
            pageSize,
            field,
            sort,
        } = router.query as ReportFilters;

        const tabIndex = reportStatuses.findIndex((s) => s.value === status);
        setCurrentTab(tabIndex !== -1 ? tabIndex : 0);
        reportId && setReportId(Number(reportId));
        project && setProject(project);
        severity && setSeverity(severity);
        hacker && setHacker(hacker);
        type && setType(type);

        const newFilters = {
            ...filters,
            ...(status && {status}),
            ...(severity && {severity}),
            ...(hacker && {hacker}),
            ...(project && {project}),
            ...(reportId && {reportId: Number(reportId)}),
            ...(type && {type}),
            ...(page && {page: Math.max(0, Number(page))}),
            ...(pageSize && {pageSize: Number(pageSize)}),
            ...(field && {field}),
            ...(sort && {sort}),
        };

        Object.keys(newFilters).length && setFilters(newFilters);
    }, [router.query]);

    const handleTabChange = (event: SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
        const selectedStatus = reportStatuses[newValue].value;
        selectedStatus && handleFilterChange({status: selectedStatus as ReportStatus, page: 0});
    };

    return (
        <>
            <Tabs
                value={currentTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                sx={{marginBottom: 2}}
            >
                {reportStatuses.map((status) => (
                    <Tab key={status.value} label={status.label}/>
                ))}
            </Tabs>

            <Box display="flex" flexDirection="column" gap={2} marginBottom={2}>
                <Box display="flex" flexWrap="wrap" gap={2}>

                    <FormControl   style={{width: 140}}>
                        <TextField
                            label="Report ID"
                            placeholder={"Search by ID"}
                            helperText={"Integers only"}
                            value={reportId !== undefined ? reportId.toString() : ""}
                            type="number"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                const newValue = event.target.value;
                                if (!newValue || !newValue.length) {
                                    setReportId(undefined);
                                    handleFilterChange({reportId: undefined});
                                } else if (/^\d*$/.test(newValue)) {
                                    setReportId(parseInt(newValue, 10));
                                    handleFilterChange({reportId: newValue === "" ? undefined : parseInt(newValue, 10)});
                                }
                            }}
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                        />
                    </FormControl>
                    <FormControl style={{minWidth: 250}}>
                        <TextField
                            label="Project"
                            placeholder={"Search title"}
                            value={project ?? ""}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                const value = event.target.value;
                                setProject(value);
                                handleFilterChange({project: value});
                            }}
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                        /> </FormControl>
                    <FormControl style={{minWidth: 250}}>
                        <TextField
                            label="Hacker"
                            placeholder={"Search email / username"}
                            value={hacker ?? ""}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                const value = event.target.value;
                                setHacker(value);
                                handleFilterChange({hacker: value});
                            }}
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                        /> </FormControl>


                    <FormControl variant={"filled"}  style={{minWidth: 200}}>
                        <InputLabel id="severity-select-label" shrink={true}>Severity</InputLabel>
                        <Select
                            labelId="severity-select-label"
                            label="Severity"
                            value={severity ?? ""}
                            onChange={(event: SelectChangeEvent<ReportSeverity>) => {
                                const value = event.target.value as ReportSeverity;
                                setSeverity(value);
                                handleFilterChange({severity: value});
                            }}
                            sx={{
                                '& .MuiSelect-select span::before': {
                                    content: "'Select...'", opacity:"0.4"
                                },
                                MuiSelect: { root: { '&.MuiFilledInput-input': { color: 'grey', opacity:"0.1" }, }, },
                            }}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {severities.map((severityLevel) => (
                                <MenuItem key={severityLevel} value={severityLevel}>
                                    {severityLevel}
                                </MenuItem>
                            ))}
                        </Select>

                    </FormControl>
                    <FormControl variant={"filled"}  style={{minWidth: 200}}>
                        <InputLabel id="severity-select-label" shrink={true}>Report Type</InputLabel>
                        <Select
                            labelId="report-type-select-label"
                            label="Report Type"
                            value={type ?? ""}
                            onChange={(event: SelectChangeEvent<ReportType>) => {
                                const value = event.target.value as ReportType;
                                setType(value);
                                handleFilterChange({type: value});
                            }}
                            sx={{
                                '& .MuiSelect-select span::before': {
                                    content: "'Select...'", opacity:"0.4"
                                },
                                MuiSelect: { root: { '&.MuiFilledInput-input': { color: 'grey', opacity:"0.1" }, }, },
                            }}
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {Object.entries(reportTypes).map(([key, value]) => (
                                <MenuItem key={key} value={key}>
                                    {value}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
        </>
    );
};
