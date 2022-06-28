## Enable GCP APIs

* Artifact Registry API
* Cloud Run API

# Github Actions & Pulumi

## Pulumi

* Create GCP service account for deploying via Pulumi. Add to secrets on Github.
* Create Pulumi access token. Add to secrets on Github.

## GCP Service Account Permissions

* Artifact Registry Administrator
* Service Account Token Creator
* Cloud Run Admin
* Service Account User

## Github Secrets

* GOOGLE_CREDENTIALS - service account key in JSON format
* DOCKER_REGISTRY - location of GAR repo
* PULUMI_ACCESS_TOKEN
* DISCORD_WEBHOOK_URL

## References

* https://qasimalbaqali.medium.com/deploy-a-stack-on-every-pull-request-using-pulumi-and-github-actions-d5dbfa8946f6
* https://ardalis.com/integrate-github-and-discord-with-webhooks/
* https://medium.com/develop-everything/create-a-cloud-run-service-and-https-load-balancer-with-pulumi-3ba542e60367

## TODO

* Production environment/deploy
* Use custom DNS for Cloud Run apps
* Check stack exists (stack manager github action)
* Cleanup outdated main images
* Use a specific Service Account for the Cloud Run Service

