import {GetServerSideProps} from "next";
import {Project, Report, User} from "@prisma/client";
import {Avatar, Button, Card, CardContent, Container, Grid, Typography} from "@mui/material";
import Link from "next/link";
import {fetchReport} from "@/utils/API";
import * as process from "node:process";
import moment from "moment/moment";

interface ReportDetailProps {
    report: (Report & {
        user: User;
        project: Project;
    }) | null;
    error: string | null;
}

const ReportDetail = ({ report, error }: ReportDetailProps) => {
    if (error) {
        return (
            <Container>
                <Typography variant="h4" color="error" gutterBottom>
                    {error}
                </Typography>
            </Container>
        );
    }

    if (!report) {
        return (
            <Container>
                <Typography variant="h4" color="textSecondary" gutterBottom>
                    Report not found
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
            <Card variant="outlined" style={{ padding: "16px" }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Report Details
                    </Typography>

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Report ID:</Typography>
                            <Typography variant="body1">{report.id}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Submission Date:</Typography>
                            <Typography variant="body1">
                                {moment(report.createdAt).toISOString()}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Project:</Typography>
                            <Typography variant="body1">{report.project.name}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Hacker:</Typography>
                            <Typography variant="body1">{report.user.email}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Severity:</Typography>
                            <Typography variant="body1">{report.severity}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Status:</Typography>
                            <Typography variant="body1">{report.status}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Type:</Typography>
                            <Typography variant="body1">{report.type}</Typography>
                        </Grid>
                    </Grid>

                    <Typography variant="h6" style={{ marginTop: "1.5rem" }}>
                        Description:
                    </Typography>
                    <Typography variant="body1">{report.description}</Typography>

                    {/* Adding Avatar */}
                    <Grid container spacing={2} style={{ marginTop: "1.5rem" }}>
                        <Grid item xs={12} sm={2}>
                            <Avatar alt={report.user.email} src="https://steamuserimages-a.akamaihd.net/ugc/956340656734710422/BDD60EF2C1699E1C8AAEA6E2E43BD643DAE49CCC/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false" />
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <Typography variant="body2" color="textSecondary">
                                Hacker Profile
                            </Typography>
                        </Grid>
                    </Grid>

                    <Link href="/">
                        <Button variant="contained" color="primary" style={{ marginTop: "1.5rem" }}>
                            Back to Reports
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </Container>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;
    let report = null;
    let error = null;

    try {
        report = await fetchReport(Number(id), process.env.NEXT_PUBLIC_API_KEY ?? "WRONG_API_KEY");
    } catch (err) {
        console.warn(err);
        error = "Error fetching report details";
    }

    return {
        props: {
            report,
            error,
        },
    };
};

export default ReportDetail;
