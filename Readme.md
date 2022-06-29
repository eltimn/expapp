## Enable GCP APIs

* Artifact Registry API
* Cloud Run API
* Cloud DNS API
* Compute Engine API
* Identity and Access Management (IAM) API

# Github Actions & Pulumi

## Pulumi

* Create GCP service account for deploying via Pulumi. Add to secrets on Github.
* Create Pulumi access token. Add to secrets on Github.

## GCP Service Account Permissions

* Artifact Registry Administrator (roles/artifactregistry.admin)
* Cloud Run Admin (roles/run.admin)
* Compute Load Balancer Admin (roles/compute.loadBalancerAdmin)
* Compute Network Admin (roles/compute.networkAdmin)
* DNS Administrator (roles/dns.admin)
* Service Account Admin (roles/iam.serviceAccountAdmin))
* Service Account Token Creator (roles/iam.serviceAccountTokenCreator)
* Service Account User (roles/iam.serviceAccountUser)

## Github Secrets

* GOOGLE_CREDENTIALS - service account key in JSON format
* DOCKER_REGISTRY - location of GAR repo
* PULUMI_ACCESS_TOKEN
* DISCORD_WEBHOOK_URL

## References

* https://qasimalbaqali.medium.com/deploy-a-stack-on-every-pull-request-using-pulumi-and-github-actions-d5dbfa8946f6
* https://ardalis.com/integrate-github-and-discord-with-webhooks/
* https://medium.com/develop-everything/create-a-cloud-run-service-and-https-load-balancer-with-pulumi-3ba542e60367
* https://www.pulumi.com/registry/packages/gcp/api-docs/compute/managedsslcertificate/

## TODO

* Static IP
* Check stack exists (stack manager github action)
* Cleanup outdated main images
