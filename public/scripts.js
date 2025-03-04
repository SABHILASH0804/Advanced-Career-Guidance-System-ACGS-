document.addEventListener("DOMContentLoaded", function() {
    fetch("/dashboard").then(response => response.json()).then(data => {
        const skillsList = document.getElementById("skills-list");
        data.resumes.forEach(resume => {
            const li = document.createElement("li");
            li.textContent = resume.skills || "No skills found";
            skillsList.appendChild(li);
        });
    });
});
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("/api/skills");
        const data = await response.json();

        const skillsContainer = document.getElementById("skills-text");
        skillsContainer.textContent = data.skills || "No skills found";
    } catch (error) {
        console.error("Error fetching skills:", error);
        document.getElementById("skills-text").textContent = "Error loading skills.";
    }
});

