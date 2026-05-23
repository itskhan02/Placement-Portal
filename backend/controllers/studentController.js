
const Application = require("../models/application");
const Job = require("../models/Job");
const User = require("../models/User");
const { extractText } = require("../utils/extractText");

const normalizeSkills = (skills) => {
  if (!skills) {
    return [];
  }

  if (Array.isArray(skills)) {
    return skills
      .map((skill) => String(skill).trim().toLowerCase())
      .filter(Boolean);
  }

  return String(skills)
    .split(",")
    .map((skill) => skill.trim().toLowerCase())
    .filter(Boolean);
};




const getSuggestionsFromAnalysis = (analysis) => {
  if (!analysis) return ["Complete resume analysis for detailed suggestions"];

  const suggestions = [];

  if (analysis.weaknesses && analysis.weaknesses.length > 0) {
    suggestions.push(...analysis.weaknesses.slice(0, 3));
  }

  if (analysis.improvements && analysis.improvements.length > 0) {
    suggestions.push(analysis.improvements[0].text);
  }

  if (analysis.missingKeywords && analysis.missingKeywords.length > 0) {
    suggestions.push(
      `Add keywords: ${analysis.missingKeywords.slice(0, 3).join(", ")}`,
    );
  }

  return suggestions.length > 0
    ? suggestions.slice(0, 5)
    : ["Keep improving your resume for better matches"];
};


exports.getDashboard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(req.user._id).populate("profile.company");
    const userSkills = normalizeSkills(user?.profile?.skills || []);

    
    const resumeScore =
  typeof user?.profile?.resumeScore === "number"
    ? user.profile.resumeScore
    : 0;

const resumeSuggestions =
  Array.isArray(user?.profile?.resumeSuggestions)
    ? user.profile.resumeSuggestions
    : ["Upload your profile resume for AI analysis"];

    const applications = await Application.find({
      applicant: req.user._id,
    }).populate({
      path: "job",
      populate: { path: "company" },
    });

    const jobs = await Job.find({
      is_active: true,
      // status: "open",
    })
      .limit(5)
      .populate("company");

    const calculateJobMatch = ({ userSkills, jobSkills, resumeScore }) => {
      const safeUserSkills = normalizeSkills(userSkills);
      const safeJobSkills = normalizeSkills(jobSkills);
      const matchedSkills = safeJobSkills.filter((skill) =>
        safeUserSkills.includes(skill),
      );

      const skillMatch = safeJobSkills.length
        ? Math.round((matchedSkills.length / safeJobSkills.length) * 100)
        : 0;

      const overallMatch = Math.round(skillMatch * 0.6 + resumeScore * 0.4);

      return {
        skillMatch,
        resumeScore,
        overallMatch,
      };
    };

    const formattedJobs = jobs.map((job) => {
      const jobSkills = normalizeSkills(job.skillsrequired);
      const match = calculateJobMatch({
        userSkills,
        jobSkills,
        resumeScore,
      });

      const alreadyApplied = applications.some(
        (app) => app.job && app.job._id.toString() === job._id.toString(),
      );

      return {
        _id: job._id,
        title: job.title || "No title",
        company: job.company,
        location: job.location || "N/A",
        salary: job.salary || "N/A",
        skills: jobSkills,
        skillMatch: match.skillMatch,
        resumeScore: match.resumeScore,
        match: match.overallMatch,
        applied: alreadyApplied,
        postedAt: job.createdAt,
      };
    });

    const formattedApps = applications
      .map((application) => {
        if (!application.job) return null;

        const jobSkills = normalizeSkills(application.job.skillsrequired);
        const match = calculateJobMatch({
          userSkills,
          jobSkills,
          resumeScore,
        });

        return {
          _id: application._id,
          company: application.job?.company?.name || "Company",
          position: application.job?.title || "N/A",
          skillMatch: match.skillMatch,
          resumeScore: match.resumeScore,
          match: match.overallMatch,
          status: application.status || "pending",
          date: application.createdAt
            ? new Date(application.createdAt).toDateString()
            : "N/A",
        };
      })
      .filter(Boolean);

    const profileSuggestions = [];
    if (!user?.profile?.bio)
      profileSuggestions.push(
        "Add a short bio so recruiters can understand your profile faster.",
      );
    if (!(user?.profile?.skills || []).length)
      profileSuggestions.push("Add skills to improve your job match score.");
    if (!(user?.profile?.education || []).length)
      profileSuggestions.push(
        "Add your education details to complete your profile.",
      );

    const allSuggestions = [...resumeSuggestions, ...profileSuggestions].slice(
      0,
      6,
    );

    res.json({
      user: {
        name: user?.name || "User",
        email: user?.email || "",
        profilePicture: user?.profile?.profilePicture || "",
      },
      stats: {
        resumeScore,
        jobMatches: formattedJobs.length,
        applications: formattedApps.length,
        views: user?.profile?.views || 0,
        suggestions: allSuggestions,
      },
      jobs: formattedJobs,
      applications: formattedApps,
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ error: err.message || "Failed to load dashboard" });
  }
};
