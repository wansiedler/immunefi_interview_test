import {ReportFilters, ReportsResponse} from "@/pages/api/reports";
import axios from "axios";

export const fetchReports = async (filters: ReportFilters, API: string) => {
    console.log("fetchReports filters " + JSON.stringify(filters))
    const {data} = await axios.get<ReportsResponse>("/api/reports", {
        params: {...filters},
        headers: {
            "Authorization": API,
        },
    });

    return data

};

export const fetchTotalReports = async (API: string) => {
    const {data} = await axios.get("/api/reports/total", {
        headers: {
            "Authorization": API,
        },
    });

    return data
};
export const fetchReport = async (id:number, API: string) => {
    const {data} = await axios.get(`http://localhost:3000/api/reports/${id}`,
        {
            headers: {
                "Authorization": API
            },
        }
    );
    return data;
};

