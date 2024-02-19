import github from "@actions/github";
import core from "@actions/core";
import { generateSecretKey, getPublicKey } from "nostr-tools/pure";

async function logIssueDetails() {
  try {
    const token = process.env.GH_TOKEN; // Accessing environment variable
    const repoFullName = process.env.GH_REPO.split("/"); // "owner/repo"
    const issueNumber = process.env.NUMBER; // The number of the issue

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

    let sk = generateSecretKey(); // `sk` is a Uint8Array
    let pk = getPublicKey(sk); // `pk` is a hex string

    // Add more fields as needed
  } catch (error) {
    core.setFailed(`Failed to fetch issue details: ${error.message}`);
  }
}

logIssueDetails();
