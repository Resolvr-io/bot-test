const core = require("@actions/core");
const github = require("@actions/github");

async function logIssueDetails() {
  try {
    const token = core.getInput("GH_TOKEN"); // Assuming GH_TOKEN is set as a secret
    const repoFullName = core.getInput("GH_REPO").split("/"); // e.g., "owner/repo"
    const issueNumber = core.getInput("NUMBER"); // The number of the issue

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
