const core = require("@actions/core");
const github = require("@actions/github");

async function logIssueDetails() {
  try {
    const token = process.env.GH_TOKEN; // Accessing environment variable
    const repoFullName = process.env.GH_REPO.split("/"); // "owner/repo"
    const issueNumber = process.env.NUMBER; // The number of the issue

    console.log(`Fetching issue details for issue #${issueNumber}...`);
    console.log(`Repository: ${repoFullName.join("/")}`);

    const octokit = github.getOctokit(token);

    // Fetch issue details
    const { data: issue } = await octokit.rest.issues.get({
      owner: repoFullName[0],
      repo: repoFullName[1],
      issue_number: issueNumber,
    });

    // Log issue details
    console.log(`Issue Title: ${issue.title}`);
    console.log(`Issue State: ${issue.state}`);
    console.log(`Issue Body: ${issue.body}`);
    // Add more fields as needed
  } catch (error) {
    core.setFailed(`Failed to fetch issue details: ${error.message}`);
  }
}

logIssueDetails();
