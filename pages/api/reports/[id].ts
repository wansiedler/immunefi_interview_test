import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

    const {id} = req.query;

    try {
        const report = await prisma.report.findUnique({
            where: {id: Number(id)},
            include: {user: true, project: true,}, 
        });

        if (!report) {
            return res.status(404).json({error: 'Report not found'});
        }

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
};

export default handler;
