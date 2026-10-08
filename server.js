const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Campus Lost & Found Backend is Running");
});

app.post("/api/student/register", (req, res) => {

    const { name, email, password, phone, department } = req.body;

    if (!name || !email || !password || !phone || !department) {
        return res.status(400).json({
            message: "Please fill all fields."
        });
    }

    db.run(
        `
        INSERT INTO students
        (name, email, password, phone, department)
        VALUES (?, ?, ?, ?, ?)
        `,
        [name, email, password, phone, department],
        function(err) {

            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(400).json({
                        message: "Email already registered."
                    });
                }

                return res.status(500).json({
                    message: "Registration failed."
                });
            }

            res.json({
                message: "Student registration successful.",
                studentId: this.lastID
            });
        }
    );
});

app.post("/api/student/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter email and password."
        });
    }

    db.get(
        `
        SELECT *
        FROM students
        WHERE email = ? AND password = ?
        `,
        [email, password],
        (err, student) => {

            if (err) {
                return res.status(500).json({
                    message: "Login failed."
                });
            }

            if (!student) {
                return res.status(401).json({
                    message: "Invalid student email or password."
                });
            }

            res.json({
                message: "Student login successful.",
                student
            });
        }
    );
});

app.post("/api/admin/register", (req, res) => {

    const { name, email, password, phone, department } = req.body;

    if (!name || !email || !password || !phone || !department) {
        return res.status(400).json({
            message: "Please fill all fields."
        });
    }

    db.run(
        `
        INSERT INTO admins
        (name, email, password, phone, department)
        VALUES (?, ?, ?, ?, ?)
        `,
        [name, email, password, phone, department],
        function(err) {

            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(400).json({
                        message: "Admin email already registered."
                    });
                }

                return res.status(500).json({
                    message: "Admin registration failed."
                });
            }

            res.json({
                message: "Admin registration successful.",
                adminId: this.lastID
            });
        }
    );
});

app.post("/api/admin/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter email and password."
        });
    }

    db.get(
        `
        SELECT *
        FROM admins
        WHERE email = ? AND password = ?
        `,
        [email, password],
        (err, admin) => {

            if (err) {
                return res.status(500).json({
                    message: "Login failed."
                });
            }

            if (!admin) {
                return res.status(401).json({
                    message: "Invalid admin email or password."
                });
            }

            res.json({
                message: "Admin login successful.",
                admin
            });
        }
    );
});

app.post("/api/reports", (req, res) => {

    const {
        caseId,
        studentEmail,
        studentName,
        type,
        itemName,
        category,
        color,
        location,
        description
    } = req.body;

    if (
        !caseId ||
        !studentEmail ||
        !studentName ||
        !type ||
        !itemName ||
        !category ||
        !color ||
        !location ||
        !description
    ) {
        return res.status(400).json({
            message: "Please fill all fields."
        });
    }

    db.run(
        `
        INSERT INTO reports
        (
            case_id,
            student_email,
            student_name,
            type,
            item_name,
            category,
            color,
            location,
            description,
            status,
            remarks
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            caseId,
            studentEmail,
            studentName,
            type,
            itemName,
            category,
            color,
            location,
            description,
            "Reported",
            ""
        ],
        function(err) {

            if (err) {

                if (err.message.includes("UNIQUE")) {
                    return res.status(400).json({
                        message: "Case ID already exists."
                    });
                }

                return res.status(500).json({
                    message: "Report submission failed."
                });
            }

            res.json({
                message: "Report submitted successfully.",
                reportId: this.lastID,
                caseId
            });
        }
    );
});

app.get("/api/reports/student/:email", (req, res) => {

    db.all(
        `
        SELECT *
        FROM reports
        WHERE student_email = ?
        ORDER BY id DESC
        `,
        [req.params.email],
        (err, reports) => {

            if (err) {
                return res.status(500).json({
                    message: "Unable to load reports."
                });
            }

            res.json(reports);
        }
    );
});

app.get("/api/reports", (req, res) => {

    db.all(
        `
        SELECT *
        FROM reports
        ORDER BY id DESC
        `,
        [],
        (err, reports) => {

            if (err) {
                return res.status(500).json({
                    message: "Unable to load reports."
                });
            }

            res.json(reports);
        }
    );
});

app.put("/api/reports/:caseId", (req, res) => {

    const { status, remarks } = req.body;
    const caseId = req.params.caseId;

    if (!status) {
        return res.status(400).json({
            message: "Status is required."
        });
    }

    db.get(
        `
        SELECT *
        FROM reports
        WHERE case_id = ?
        `,
        [caseId],
        (err, report) => {

            if (err) {
                return res.status(500).json({
                    message: "Unable to find report."
                });
            }

            if (!report) {
                return res.status(404).json({
                    message: "Report not found."
                });
            }

            db.run(
                `
                UPDATE reports
                SET
                    status = ?,
                    remarks = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE case_id = ?
                `,
                [status, remarks || "", caseId],
                function(err) {

                    if (err) {
                        return res.status(500).json({
                            message: "Unable to update report."
                        });
                    }

                    const message =
                        "Your report " +
                        caseId +
                        " has been updated to: " +
                        status +
                        ". " +
                        (remarks
                            ? "Admin remarks: " + remarks
                            : "");

                    db.run(
                        `
                        INSERT INTO notifications
                        (student_email, message)
                        VALUES (?, ?)
                        `,
                        [report.student_email, message],
                        () => {

                            res.json({
                                message:
                                    "Report updated and student notified."
                            });

                        }
                    );
                }
            );
        }
    );
});

app.get("/api/notifications/student/:email", (req, res) => {

    db.all(
        `
        SELECT *
        FROM notifications
        WHERE student_email = ?
        ORDER BY id DESC
        `,
        [req.params.email],
        (err, notifications) => {

            if (err) {
                return res.status(500).json({
                    message: "Unable to load notifications."
                });
            }

            res.json(notifications);
        }
    );
});

app.put("/api/notifications/:id/read", (req, res) => {

    db.run(
        `
        UPDATE notifications
        SET is_read = 1
        WHERE id = ?
        `,
        [req.params.id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    message: "Unable to update notification."
                });
            }

            res.json({
                message: "Notification marked as read."
            });
        }
    );
});

app.put("/api/notifications/student/:email/read-all", (req, res) => {

    db.run(
        `
        UPDATE notifications
        SET is_read = 1
        WHERE student_email = ?
        `,
        [req.params.email],
        function(err) {

            if (err) {
                return res.status(500).json({
                    message: "Unable to update notifications."
                });
            }

            res.json({
                message: "All notifications marked as read."
            });
        }
    );
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Server running at http://localhost:3000");
});