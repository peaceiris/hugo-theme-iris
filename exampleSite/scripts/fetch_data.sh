#!/usr/bin/env bash

# fail on unset variables and command errors
set -eu -o pipefail # -x: is for debugging

gh api graphql -F owner="$1" -f query='
query($owner: String!) {
  user(login: $owner) {
    login
    sponsorshipsAsMaintainer(first: 99) {
      nodes {
        sponsor {
          login
        }
      }
    }
    repositories(orderBy: {field: STARGAZERS, direction: DESC}, first: 50, affiliations: OWNER, privacy: PUBLIC, isFork: false) {
      nodes {
        nameWithOwner
        owner {
          login
        }
        name
        description
        url
        primaryLanguage {
          name
        }
        forkCount
        stargazers {
          totalCount
        }
      }
    }
  }
}
'
