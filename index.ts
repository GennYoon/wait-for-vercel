// Copyright (c) 2024 Webchemist Corp
// License: MIT

import * as core from "@actions/core";
import * as github from "@actions/github";
import axios from "axios";

(async () => {
  try {
    const VERCEL_TOKEN = core.getInput("token", { required: true });
    const PROJECT_ID = core.getInput("project-id", { required: true });
    const TEAM_ID = core.getInput("team-id", { required: false });
    const TIMEOUT = core.getInput("timeout", { required: false });
    const SHA = core.getInput("sha", { required: true });

    let request_url = `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&limit=1`;
    if (TEAM_ID) request_url += `&teamId=${TEAM_ID}`;

    let count = Number(TIMEOUT) / 1000;
    const interval = setInterval(async () => {
      const { data } = await axios.get(request_url, { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } });
      // console.log(JSON.stringify(data, null, 2));
      const deployment = data.deployments[0];
      if (count === 0) {
        clearInterval(interval);
        core.setFailed("Timeout");
      }

      // if (deployment.state === "READY") {
      if (deployment.meta.githubCommitSha === SHA && deployment.state === "READY") {
        const url = deployment.meta.branchAlias || deployment.url;
        core.setOutput("url", `https://${url}`);
        clearInterval(interval);
      }
      count--;
    }, 1000);
  } catch (error) {
    core.setFailed(error as string | Error);
  }
})();
