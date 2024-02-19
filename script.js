import github from "@actions/github";
import core from "@actions/core";
import {
  generateSecretKey,
  getPublicKey,
  finalizeEvent,
  verifyEvent,
} from "nostr-tools/pure";
import { SimplePool } from "nostr-tools/pool";
import * as nip19 from "nostr-tools/nip19";
import { useWebSocketImplementation } from 'nostr-tools/relay'
useWebSocketImplementation(require('ws'))

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

    console.log(`Secret Key: ${sk}`);
    console.log(`Public Key: ${pk}`);

    let eventTemplate = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: `Issue Title: ${issue.title}\nIssue State: ${issue.state}\nIssue Body: ${issue.body}`,
    };

    let relays = ["wss://nos.lol"];

    let npub = nip19.npubEncode(pk);

    console.log("npub: ", npub);

    // this assigns the pubkey, calculates the event id and signs the event in a single step
    const signedEvent = finalizeEvent(eventTemplate, sk);

    const verified = verifyEvent(signedEvent);
    console.log("verified: ", verified);

    console.log("publishing to relays...");
    console.log("signed event: ", signedEvent);

    const pool = new SimplePool();
    // await Promise.any(pool.publish(relays, signedEvent));
    const publishedEvent = await Promise.any(pool.publish(relays, signedEvent));
    console.log("published event: ", publishedEvent);

    console.log("published to at least one relay!");

    // Add more fields as needed
  } catch (error) {
    core.setFailed(`Failed to fetch issue details: ${error.message}`);
  }
}

logIssueDetails();
