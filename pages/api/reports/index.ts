import { Project, Report } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type ReportsResponse = {
  reports: Reports;
  meta: Meta;
};

type ErrorResponse = {
  error: string;
};

type Reports = {
  id: number;
  status: string;
  type: string;
  severity: string;
  title: string;
  createdAt: string;
  project: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    email: string;
  };
}[];;

type Meta = {
  page: number;
  totalPages: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReportsResponse | ErrorResponse>
) {
  if (req.method !== "GET") {
    res.status(404).json({ error: "Not found" });
    return;
  }

  // TODO: return the reports list
  const reports: Reports = [];
  const meta: Meta = {
    page: 1,
    totalPages: 1,
  };

  res.status(418).json({ reports, meta });
}
