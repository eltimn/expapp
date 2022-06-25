"use strict";

const pulumi = require("@pulumi/pulumi");
const gcp = require("@pulumi/gcp");

// config values
const config = new pulumi.Config();
// // const branch = config.require("git_branch");
// // const sha = config.require("git_sha");
const image_uri = config.require("image_uri");

// Location to deploy Cloud Run services
const region = gcp.config.region || "us-central1";

// The cloud run service
const appService = new gcp.cloudrun.Service("expapp", {
  location: region,
  template: {
    spec: {
      containers: [{
        image: image_uri,
        ports: [{ containerPort: 8080 }],
        resources: {
          limits: {
            cpu: '1000m',
            memory: '256Mi',
          },
        }
      }]
    }
  },
  traffics: [{ percent: 100, latestRevision: true }],
});

// allow all users access to service
new gcp.cloudrun.IamMember("expapp-all-users", {
  service: appService.name,
  location: appService.location,
  role: "roles/run.invoker",
  member: "allUsers"
});

// Exports
exports.url = appService.statuses[0].url;
// exports.image_uri = image_uri;
// exports.region = region;
