// Copyright (c) 2024 Webchemist Corp
// License: MIT

/**
 * {
|       "uid": "dpl_FbmsBL4R7KCiV6SsEQ3KtjsiDENu",
|       "name": "hey-seller",
|       "url": "hey-seller-olpt1b3az-heyseller.vercel.app",
|       "created": 1726803317460,
|       "source": "git",
|       "state": "CANCELED",
|       "readyState": "CANCELED",
|       "type": "LAMBDAS",
|       "creator": {
|         "uid": "nt5HVtTpmc6kMz7oO7F4yk07",
|         "email": "yoonwonyoul@webchemist.net",
|         "username": "webchemist",
|         "githubLogin": "GennYoon"
|       },
|       "inspectorUrl": "https://vercel.com/heyseller/hey-seller/FbmsBL4R7KCiV6SsEQ3KtjsiDENu",
|       "meta": {
|         "githubCommitAuthorName": "GennYoon",
|         "githubCommitMessage": "feat: playwright의 target을 vercel 결과물로 합니다.",
|         "githubCommitOrg": "RapidGlobalLab",
|         "githubCommitRef": "develop",
|         "githubCommitRepo": "rapid-monorepo",
|         "githubCommitSha": "51ad537542d56ce7b04ffac96bd8e750bcf8b15a",
|         "githubDeployment": "1",
|         "githubOrg": "RapidGlobalLab",
|         "githubRepo": "rapid-monorepo",
|         "githubRepoOwnerType": "Organization",
|         "githubCommitRepoId": "656055458",
|         "githubRepoId": "656055458",
|         "githubRepoVisibility": "private",
|         "githubCommitAuthorLogin": "GennYoon",
|         "branchAlias": "hey-seller-git-develop-heyseller.vercel.app"
|       },
|       "target": null,
|       "aliasAssigned": null,
|       "isRollbackCandidate": false,
|       "createdAt": 1726803317460,
|       "buildingAt": 1726803329008,
|       "ready": 1726803338107,
|       "projectSettings": {
|         "commandForIgnoringBuildStep": "npx turbo-ignore"
|       }
|     }
 * */

import * as core from "@actions/core";
// import * as github from "@actions/github";
import axios from "axios";
import _ from "lodash";

interface Deployment {
  state: string;
  url: string;
  meta: { githubCommitSha: string; branchAlias: string };
}

(async () => {
  try {
    const VERCEL_TOKEN = core.getInput("token", { required: true });
    const PROJECT_ID = core.getInput("project-id", { required: true });
    const TEAM_ID = core.getInput("team-id", { required: false });
    const TIMEOUT = core.getInput("timeout", { required: false });
    const SHA = core.getInput("sha", { required: true });

    let request_url = `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&limit=100`;
    if (TEAM_ID) request_url += `&teamId=${TEAM_ID}`;

    let count = Number(TIMEOUT) / 1000;
    const interval = setInterval(async () => {
      const { data } = await axios.get(request_url, { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } });

      const index = _.findIndex<Deployment>(data.deployments, (d) => {
        return d.meta.githubCommitSha === SHA;
      });
      const deployment = data.deployments[index];
      if (count === 0) {
        clearInterval(interval);
        core.setFailed("Timeout");
      }

      if (deployment && deployment.state === "READY") {
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
