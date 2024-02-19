const core = require("@actions/core");
const github = require("@actions/github");

const token = core.getInput("GH_TOKEN");
const [owner, repo] = process.env.GH_REPO.split("/");
const issueNumber = core.getInput("NUMBER");
const labelsToAdd = core.getInput("LABELS").split(",");

const octokit = github.getOctokit(token);

(async () => {
  try {
    await octokit.rest.issues.addLabels({
      owner,
      repo,
      issue_number: parseInt(issueNumber),
      labels: labelsToAdd,
    });

    console.log(`Labels added to issue number ${issueNumber}: ${labelsToAdd}`);
  } catch (error) {
    core.setFailed(`Failed to add labels: ${error.message}`);
  }
})();
