"use strict";

const pulumi = require("@pulumi/pulumi");
const gcp = require("@pulumi/gcp");

// // required config values
const config = new pulumi.Config();
// // const branch = config.require("git_branch");
// // const sha = config.require("git_sha");
const image_uri = config.require("image_uri");
// const location = config.require("gcp_location");

// Location to deploy Cloud Run services
const region = gcp.config.region || "us-central1";

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

// allow all users accesss to service
new gcp.cloudrun.IamMember("expapp-all-users", {
  service: appService.name,
  location: appService.location,
  role: "roles/run.invoker",
  member: "allUsers"
});

// appService.statuses[0].url.apply(v => console.log('url:', v))

// // Create a GCP resource (Storage Bucket)
// // const bucket = new gcp.storage.Bucket("my-bucket", {
// //     location: "US"
// // });

// // Exports
// exports.readme = appService.status.url;
exports.url = appService.statuses[0].url;
exports.image_uri = image_uri;
exports.region = region;
// // exports.region = region;
// // exports.branch = branch;
// // exports.sha = sha;
