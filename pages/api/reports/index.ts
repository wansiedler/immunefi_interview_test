import {Prisma, PrismaClient, Report, ReportSeverity, ReportStatus, ReportType} from "@prisma/client";
import type {NextApiRequest, NextApiResponse} from "next";
import {parseIntWithFallback} from "@/utils/utils";
import SortOrder = Prisma.SortOrder;

export type Meta = {
    foundReports: number;
    pageSize: number;
    totalPages: number;
};

export type ReportsResponse = {
    reports: PopulatedReport[];
    meta: Meta;
};

export type ErrorResponse = {
    error: string;
};

export type PopulatedReport = (Omit<Report, "projectId" | "userId" | "createdAt"| "description"> & {
    createdAt: string;
});


const prisma = new PrismaClient();

export interface ReportFilters {
    status?: ReportStatus;
    reportId?: number;
    severity?: ReportSeverity;
    type?: ReportType;
    hacker?: string;
    project?: string;
    createdAt?: string;
    field?: string
    sort?: SortOrder;
    page?: number;
    pageSize?: number;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ReportsResponse | ErrorResponse>
) {
    if (req.method !== "GET") {
        console.warn("Wrong method")
        res.status(404).json({error: "Not found"});
        return;
    }

    //API CHECK
    const apiKey = req.headers['authorization'];
    if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
        console.warn("Unauthorized: Invalid API key " + apiKey)
        return res.status(401).json({error: "Unauthorized: Invalid API key"});
    }

    let {
        status,
        reportId,
        severity,
        type,
        hacker,
        project,
        field = "createdAt",
        sort = 'asc',
        page,
        pageSize,
    } = req.query as ReportFilters;

    console.log(status,
        severity,
        type,
        hacker,
        reportId,
        project,
        field,
        sort,
        page,
        pageSize)

    try {
        //BASIC VALIDATION
        page = parseIntWithFallback(page, 0)
        pageSize = parseIntWithFallback(pageSize, 10)
        const skip = page * pageSize;
        reportId = parseIntWithFallback(reportId, undefined)
        status = Object.keys(ReportStatus).includes(status as string) ? status : undefined
        severity = Object.keys(ReportSeverity).includes(severity as string) ? severity : undefined
        type = Object.keys(ReportType).includes(type as string) ? type : undefined

        // !!!!!
        // I DONT KNOW WHY BUT PUTTING THIS IN THE QUERY OBJECT AND PASSING IT TO THE PRISMA prisma.report.count() AND prisma.report.findMany() BREAKS THE QUERY
        // FORCED TO DUPLICATE IN MY INTELIJ IDEA
        // !!!!!
        const q = {
            where: {
                //.....
            }
        }


        const [foundReports, reportsData,] = await prisma.$transaction([
            prisma.report.count({
                where: {
                    ...(reportId && {id: reportId}), ...(project && {
                        project: {
                            name: {
                                contains: project,
                                mode: 'insensitive'
                            }
                        }
                    }), ...(hacker && {
                        OR: [{
                            user: {
                                username: {
                                    contains: hacker,
                                    mode: 'insensitive'
                                }
                            }
                        }, {user: {email: {contains: hacker, mode: 'insensitive'}}}]
                    }), ...(status && {status: status}), ...(severity && {severity: severity}), ...(type && {type: type}),
                }
            }),
            prisma.report.findMany({
                skip,
                take: pageSize,
                include: {
                    project: true, user: true,
                },
                where: {
                    ...(reportId && {id: reportId}), ...(project && {
                        project: {
                            name: {
                                contains: project,
                                mode: 'insensitive'
                            }
                        }
                    }), ...(hacker && {
                        OR: [{
                            user: {
                                username: {
                                    contains: hacker,
                                    mode: 'insensitive'
                                }
                            }
                        }, {user: {email: {contains: hacker, mode: 'insensitive'}}}]
                    }), ...(status && {status: status}), ...(severity && {severity: severity}), ...(type && {type: type}),
                },
                orderBy: (() => {
                    if (field === 'user') {
                        return {user: {username: sort}}
                    }
                    if (field === 'project') {
                        return {project: {name: sort}}
                    }
                    return {[field]: sort}
                })()
            }),
        ])


        const totalPages = Math.ceil(foundReports / pageSize);

        const reports: PopulatedReport[] = reportsData.map((report) => ({
            id: report.id,
            status: report.status,
            type: report.type,
            severity: report.severity,
            title: report.title,
            createdAt: report.createdAt.toISOString(),
            project: {
                id: report.project.id,
                name: report.project.name,
            },
            user: {
                id: report.user.id,
                email: report.user.email,
                username: report.user.username,
            },
        }));

        const meta: Meta = {
            foundReports, pageSize, totalPages,
        };

        res.status(200).json({reports, meta,});

    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({error: 'Internal server error'});
    } finally {
        await prisma.$disconnect();
    }
}
