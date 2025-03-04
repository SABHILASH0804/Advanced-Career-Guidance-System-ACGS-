const fs = require("fs");
const pdfParse = require("pdf-parse");

// Predefined list of skills
const skillKeywords = [
    "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "Ruby", "Go", "Rust", "Kotlin", "Swift", 
    "PHP", "R", "MATLAB", "Scala", "Perl", "HTML", "CSS", "SQL", "Bash",

    "React.js", "Angular", "Vue.js", "Svelte", "Node.js", "Django", "Flask", "Spring Boot", 
    "ASP.NET", "Ruby on Rails", "Laravel", "Bootstrap", "Tailwind CSS", "jQuery", "Express.js",

    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-Learn", "Keras", 
    "Pandas", "NumPy", "Matplotlib", "Seaborn", "RStudio", "Data Analysis", "Predictive Modeling", 
    "Big Data", "Hadoop", "Spark", "Data Visualization", "Tableau", "Power BI", "NLP", 
    "Computer Vision", "Data Wrangling", "Jupyter Notebook",

    "Docker", "Kubernetes", "Jenkins", "Ansible", "Terraform", "GitHub Actions", "Azure DevOps", 
    "AWS", "Google Cloud Platform (GCP)", "Microsoft Azure", "CI/CD Pipelines", 
    "Serverless Architecture", "CloudFormation",

    "Android Development", "iOS Development", "Flutter", "React Native", "SwiftUI", 
    "Kotlin Multiplatform", "Xamarin",

    "PostgreSQL", "MySQL", "MongoDB", "Oracle", "Cassandra", "Redis", "Elasticsearch", 
    "MariaDB", "DynamoDB", "Firebase",

    "Penetration Testing", "Ethical Hacking", "Network Security", "Cryptography", 
    "Risk Assessment", "Vulnerability Management", "Kali Linux", "Wireshark", "Metasploit",

    "Agile Methodology", "Scrum", "Kanban", "DevOps Practices", "Microservices Architecture", 
    "REST API", "GraphQL", "TDD (Test-Driven Development)", "BDD (Behavior-Driven Development)", 
    "Design Patterns", "Version Control (Git)",

    "JIRA", "Trello", "Asana", "Confluence", "Slack", "Notion", "MS Project", 
    "Time Management", "Stakeholder Management", "Budgeting", "Gantt Charts", "Risk Management",

    "Leadership", "Communication", "Problem-Solving", "Time Management", "Critical Thinking", 
    "Adaptability", "Teamwork", "Creativity", "Negotiation", "Decision-Making", 
    "Emotional Intelligence", "Conflict Resolution",

    "Generative AI", "Chatbots", "Reinforcement Learning", "Blockchain", 
    "Internet of Things (IoT)", "Edge Computing", "AR/VR Development", "Quantum Computing",

    "Digital Marketing", "SEO", "SEM", "Content Strategy", "Social Media Management", 
    "Google Analytics", "Market Research", "Brand Management", 
    "Customer Relationship Management (CRM)", "Salesforce", "HubSpot",

    "Figma", "Adobe XD", "Sketch", "InVision", "Wireframing", "Prototyping", 
    "Usability Testing", "Design Thinking", "User Research", "Interaction Design", 
    "Accessibility Design",

    "Financial Modeling", "Budgeting", "Forecasting", "Financial Analysis", 
    "QuickBooks", "SAP", "Oracle Financials", "Auditing", "Taxation", "Payroll Management",

    "CAD (AutoCAD, SolidWorks)", "MATLAB", "Lean Manufacturing", "Six Sigma", 
    "Quality Assurance", "Supply Chain Management", "Robotics", "Mechatronics", 
    "Industrial Automation"
];

/**
 * Extracts skills from a resume PDF file.
 * @param {string} filePath - The path of the uploaded resume file.
 * @returns {Promise<string>} - A string containing extracted skills.
 */
async function extractSkills(filePath) {
    try {
        // Read the PDF file
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        const text = pdfData.text.toLowerCase(); // Convert to lowercase for consistency

        // Extract skills that are in the predefined list
        let extractedSkills = skillKeywords.filter(skill =>
            text.includes(skill.toLowerCase()) // Case-insensitive matching
        );

        // Remove duplicates
        extractedSkills = [...new Set(extractedSkills)];

        console.log("Extracted Skills:", extractedSkills);

        return extractedSkills.length > 0 ? extractedSkills.join(", ") : "No relevant skills found";
    } catch (error) {
        console.error("Error extracting skills:", error);
        return "Error extracting skills";
    }
}

module.exports = extractSkills;
