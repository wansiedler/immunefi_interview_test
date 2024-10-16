import {PrismaClient} from "@prisma/client";
import type {NextApiRequest, NextApiResponse} from "next";
import {ErrorResponse} from "@/pages/api/reports/index";


export type TotalReportsResponse = {
    totalReports: number;
}
const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TotalReportsResponse | ErrorResponse>
) {
    if (req.method !== "GET") {
        console.warn("Wrong method")
        res.status(404).json({error: "Not found"});
        return;
    }

    const apiKey = req.headers['authorization'];
    if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
        console.warn("Unauthorized: Invalid API key " + apiKey)
        return res.status(401).json({error: "Unauthorized: Invalid API key"});
    }

    try {
        const totalReports = await prisma.report.count()
        res.status(200).json({totalReports});
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({error: 'Internal server error'});
    } finally {
        await prisma.$disconnect();
    }
}
