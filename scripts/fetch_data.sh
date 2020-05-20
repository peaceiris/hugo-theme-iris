#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

export QUERY_GRAPHQL="
{
  user(login: \"$2\") {
    repositories(orderBy: {field: STARGAZERS, direction: DESC}, first: 50, affiliations: OWNER, privacy: PUBLIC, isFork: false) {
      nodes {
        nameWithOwner,
        owner {
          login
        },
        name,
        description,
        url,
        primaryLanguage {
          name
        },
        forkCount,
        stargazers {
          totalCount
        }
      }
    }
  }
}
"
export QUERY_JSON="$(echo ${QUERY_GRAPHQL} | tr -d "\n" | tr -d " " | sed 's/"/\\"/g')"
curl -s -H "Authorization: token $1" \
  -X POST \
  -d "{\"query\":\"query${QUERY_JSON}\"}" \
  https://api.github.com/graphql
