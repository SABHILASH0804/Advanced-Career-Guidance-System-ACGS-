const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const mysql = require("./db");
const extractSkills = require("./resumeParser");
const { getJson } = require("serpapi"); // Import SerpAPI

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true
}));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Multer Configuration for File Uploads
const upload = multer({ dest: "uploads/" });

// Career Progression Dataset (unchanged)
const careerProgression =  {
    "Python": ["Junior Python Developer", "Python Developer", "Senior Python Developer", "Lead Software Engineer", "Software Architect"],
    "Java": ["Junior Java Developer", "Java Developer", "Senior Java Developer", "Lead Software Engineer", "Java Solutions Architect"],
    "C++": ["Junior C++ Developer", "C++ Developer", "Senior C++ Developer", "Lead Software Engineer", "Embedded Systems Engineer"],
    "C#": ["Junior C# Developer", "C# Developer", "Senior C# Developer", "Lead Software Engineer", "Microsoft Solutions Architect"],
    "JavaScript": ["Frontend Developer (Junior)", "Frontend Developer", "Senior Frontend Developer", "Full Stack Developer", "Technical Lead"],
    "TypeScript": ["Frontend Developer (Junior)", "Frontend Developer", "Senior Frontend Developer", "Full Stack Developer", "Technical Lead"],
    "Ruby": ["Junior Ruby Developer", "Ruby on Rails Developer", "Senior Ruby Developer", "Lead Backend Engineer"],
    "Go": ["Junior Go Developer", "Go Developer", "Senior Go Developer", "Lead Backend Engineer", "Cloud Engineer"],
    "Rust": ["Junior Rust Developer", "Rust Developer", "Senior Rust Developer", "Systems Engineer", "Blockchain Engineer"],
    "Kotlin": ["Junior Android Developer", "Android Developer", "Senior Android Developer", "Mobile Solutions Architect"],
    "Swift": ["Junior iOS Developer", "iOS Developer", "Senior iOS Developer", "Mobile Solutions Architect"],
    "PHP": ["Junior PHP Developer", "PHP Developer", "Senior PHP Developer", "Full Stack Developer", "Tech Lead"],
    "R": ["Data Analyst", "Data Scientist", "Senior Data Scientist", "AI/ML Engineer"],
    "MATLAB": ["Junior Data Scientist", "Data Scientist", "Senior Data Scientist", "AI Researcher", "Systems Engineer"],
    "Scala": ["Junior Scala Developer", "Scala Developer", "Senior Scala Engineer", "Big Data Engineer"],
    "Perl": ["Junior Perl Developer", "Perl Developer", "Senior Perl Developer", "DevOps Engineer"],
    "HTML": ["Junior Frontend Developer", "Frontend Developer", "Senior Frontend Developer", "Full Stack Developer"],
    "CSS": ["Junior UI Developer", "UI/UX Developer", "Senior UI/UX Developer", "Frontend Architect"],
    "SQL": ["Database Administrator (Junior)", "Database Administrator", "Senior DBA", "Data Engineer"],
    "Bash": ["System Administrator", "DevOps Engineer", "Senior DevOps Engineer", "Cloud Architect"],

    "React.js": ["React Developer (Junior)", "React Developer", "Senior React Developer", "Full Stack Engineer"],
    "Angular": ["Angular Developer (Junior)", "Angular Developer", "Senior Angular Developer", "Tech Lead"],
    "Vue.js": ["Vue.js Developer (Junior)", "Vue.js Developer", "Senior Vue.js Developer", "Full Stack Engineer"],
    "Svelte": ["Svelte Developer (Junior)", "Svelte Developer", "Senior Svelte Developer", "Frontend Architect"],
    "Node.js": ["Node.js Developer (Junior)", "Node.js Developer", "Senior Node.js Developer", "Full Stack Engineer"],

    "Django": ["Django Developer (Junior)", "Django Developer", "Senior Django Developer", "Software Engineer"],
    "Flask": ["Flask Developer (Junior)", "Flask Developer", "Senior Flask Developer", "Backend Engineer"],
    "Spring Boot": ["Spring Boot Developer (Junior)", "Spring Boot Developer", "Senior Spring Boot Developer", "Java Solutions Architect"],
    "ASP.NET": ["ASP.NET Developer (Junior)", "ASP.NET Developer", "Senior ASP.NET Developer", "Software Architect"],

    "Machine Learning": ["ML Engineer (Junior)", "Machine Learning Engineer", "Senior ML Engineer", "AI Researcher"],
    "Deep Learning": ["DL Engineer (Junior)", "Deep Learning Engineer", "Senior Deep Learning Engineer", "AI Architect"],
    "TensorFlow": ["Junior AI Engineer", "AI Engineer", "Senior AI Engineer", "AI Researcher"],

    "Docker": ["DevOps Engineer (Junior)", "DevOps Engineer", "Senior DevOps Engineer", "Cloud Engineer"],
    "Kubernetes": ["Cloud Engineer (Junior)", "Cloud Engineer", "Senior Cloud Engineer", "Cloud Architect"],
    "Jenkins": ["CI/CD Engineer (Junior)", "CI/CD Engineer", "Senior CI/CD Engineer", "Cloud Architect"],

    "AWS": ["Cloud Engineer (Junior)", "AWS Engineer", "Senior AWS Engineer", "Cloud Solutions Architect"],
    "Google Cloud Platform (GCP)": ["GCP Engineer (Junior)", "GCP Engineer", "Senior GCP Engineer", "Cloud Solutions Architect"],
    "Microsoft Azure": ["Azure Engineer (Junior)", "Azure Engineer", "Senior Azure Engineer", "Cloud Solutions Architect"],

    "PostgreSQL": ["Database Administrator (Junior)", "Database Administrator", "Senior DBA", "Database Architect"],
    "MySQL": ["Database Administrator (Junior)", "Database Administrator", "Senior DBA", "Database Architect"],

    "Penetration Testing": ["Security Analyst (Junior)", "Penetration Tester", "Senior Penetration Tester", "Cybersecurity Consultant"],
    "Ethical Hacking": ["Ethical Hacker (Junior)", "Ethical Hacker", "Senior Ethical Hacker", "Cybersecurity Architect"],
    "Network Security": ["Security Analyst (Junior)", "Network Security Engineer", "Senior Security Engineer", "Security Architect"],

    "Agile Methodology": ["Scrum Master (Junior)", "Scrum Master", "Senior Scrum Master", "Agile Coach"],
    "DevOps Practices": ["DevOps Engineer (Junior)", "DevOps Engineer", "Senior DevOps Engineer", "Cloud Solutions Architect"],

    "CAD (AutoCAD, SolidWorks)": ["CAD Technician", "Mechanical Designer", "Senior Mechanical Engineer", "Design Engineering Manager"],
    "Lean Manufacturing": ["Lean Manufacturing Specialist", "Process Engineer", "Senior Process Engineer", "Operations Manager"],
    "Six Sigma": ["Six Sigma Analyst", "Six Sigma Consultant", "Senior Process Improvement Manager", "Director of Quality Assurance"],
    "Supply Chain Management": ["Supply Chain Analyst", "Logistics Coordinator", "Senior Supply Chain Manager", "Chief Supply Chain Officer"],
    "Robotics": ["Robotics Engineer", "Automation Engineer", "Senior Robotics Engineer", "Robotics Researcher"],

    "Leadership": ["Team Lead (Junior)", "Project Manager", "Senior Project Manager", "CTO"],
    "Communication": ["Business Analyst (Junior)", "Business Analyst", "Senior Business Analyst", "Product Manager"],
    "Problem-Solving": ["Software Engineer (Junior)", "Software Engineer", "Senior Software Engineer", "Tech Lead"],

    "Digital Marketing": ["Marketing Analyst", "SEO Specialist", "Senior Digital Marketer", "Marketing Director"],
    "SEO": ["SEO Analyst", "SEO Manager", "Senior SEO Manager", "Head of Digital Marketing"],

    "Figma": ["UI/UX Designer (Junior)", "UI/UX Designer", "Senior UI/UX Designer", "Design Lead"],
    "Adobe XD": ["UX Designer (Junior)", "UX Designer", "Senior UX Designer", "Head of UX"],

    "Financial Modeling": ["Finance Analyst", "Investment Analyst", "Senior Finance Analyst", "Finance Director"],
    "Budgeting": ["Finance Assistant", "Budget Analyst", "Senior Budget Manager", "CFO"]
};

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/login-page", (req, res) => {
    console.log("Serving index.html"); // Debug log
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Home Page - Login & Signup (unchanged)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// User Signup (unchanged)
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    mysql.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
        [name, email, hashedPassword], 
        (err) => {
            if (err) {
                console.error("Signup Error:", err);
                return res.status(500).send("User already exists or an error occurred.");
            }
            res.redirect("/");
        }
    );
});

// User Login (unchanged)
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    mysql.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).send("Invalid credentials");

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send("Invalid credentials");

        req.session.userId = user.id;
        res.redirect("/dashboard");
    });
});

// Dashboard - Display User Skills (unchanged)
app.get("/dashboard", (req, res) => {
    if (!req.session.userId) return res.redirect("/");

    mysql.query("SELECT skills FROM users WHERE id = ?", [req.session.userId], (err, results) => {
        if (err) return res.status(500).send("Error retrieving skills.");
        const userSkills = results[0]?.skills || "No skills found";
        res.render("dashboard", { skills: userSkills });
    });
});

// Upload & Parse Resume (unchanged)
app.post("/upload", upload.single("resume"), async (req, res) => {
    if (!req.session.userId) return res.status(401).send("Login required");

    const filePath = req.file.path;

    try {
        const newSkills = await extractSkills(filePath);
        if (!newSkills || newSkills.trim() === "") return res.redirect("/dashboard");

        mysql.query("SELECT skills FROM users WHERE id = ?", [req.session.userId], (err, results) => {
            if (err) return res.status(500).send("Error fetching existing skills.");

            const existingSkills = results[0]?.skills ? results[0].skills.split(", ") : [];
            const updatedSkills = [...new Set([...existingSkills, ...newSkills.split(", ")])].filter(skill => skill.trim() !== "").join(", ");

            if (updatedSkills !== existingSkills.join(", ")) {
                mysql.query("UPDATE users SET skills = ? WHERE id = ?", 
                    [updatedSkills, req.session.userId], 
                    (err) => {
                        if (err) return res.status(500).send("Error updating skills.");
                        res.redirect("/dashboard");
                    }
                );
            } else {
                res.redirect("/dashboard");
            }
        });

    } catch (error) {
        console.error("Error extracting skills:", error);
        res.status(500).send("Error processing resume.");
    }
});

// API to Fetch Skills for Frontend (unchanged)
app.get("/api/skills", (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Unauthorized" });

    mysql.query("SELECT skills FROM users WHERE id = ?", [req.session.userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        const skills = results[0]?.skills || "No skills found";
        res.json({ skills });
    });
});

// API to Fetch Career Progression (unchanged)
app.get("/api/career-path", (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Unauthorized" });

    mysql.query("SELECT skills FROM users WHERE id = ?", [req.session.userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        // Ensure skills exist and are not null/undefined before splitting
        const userSkills = (results.length > 0 && results[0]?.skills) ? results[0].skills.split(", ") : [];

        const careerPaths = {};
        userSkills.forEach(skill => {
            if (careerProgression[skill]) {
                careerPaths[skill] = careerProgression[skill];
            }
        });

        res.json({ careerPaths });
    });
});

// API to Fetch Job Recommendations
// ... (previous code remains unchanged)

// API to Fetch Job Recommendations (updated to include job links)
// API to Fetch Job Recommendations for India
// API to Fetch Job Recommendations with State Filtering
app.get("/api/job-recommendations", async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Unauthorized" });

    const state = req.query.state || "India"; // Default to "India" if no state is provided

    try {
        // Fetch user skills from the database
        const results = await new Promise((resolve, reject) => {
            mysql.query("SELECT skills FROM users WHERE id = ?", [req.session.userId], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });

        const userSkills = results[0]?.skills ? results[0].skills.split(", ") : [];
        const skillWiseJobs = {};

        // Fetch job recommendations for each skill
        for (const skill of userSkills) {
            const jobs = await getJson({
                engine: "google_jobs",
                q: `${skill}`, // Search query for the skill
                location: state, // Use the selected state
                gl: "in", // Set the country code to India
                hl: "en", // Language preference
                api_key: "531df4679f22809587f6104be42f99f1b0004d2ce4ad1fea77ed31f55cb0ce66" // Replace with your SerpAPI key
            });

            if (jobs && jobs.jobs_results) {
                // Add job link to each job result
                const jobsWithLinks = jobs.jobs_results.map(job => ({
                    title: job.title,
                    company_name: job.company_name,
                    location: job.location,
                    link: job.related_links?.[0]?.link || job.link || `https://www.google.com/search?q=${encodeURIComponent(job.title + " " + job.company_name + " " + job.location)}` // Use the job link if available
                }));

                // Group jobs by skill
                skillWiseJobs[skill] = jobsWithLinks;
            }
        }

        res.json({ skillWiseJobs });
    } catch (error) {
        console.error("Error fetching job recommendations:", error);
        res.status(500).json({ error: "Failed to fetch job recommendations" });
    }
});


// Logout (unchanged)
app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
});

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public'))); // If you have a public folder

// Serve index.html at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve home.html from the views folder
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
