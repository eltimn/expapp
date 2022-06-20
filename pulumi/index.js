"use strict";

const pulumi = require("@pulumi/pulumi");
const gcp = require("@pulumi/gcp");

// required config values
const config = new pulumi.Config();
// const branch = config.require("git_branch");
// const sha = config.require("git_sha");
const image_uri = config.require("image_uri");
const location = config.require("gcp_location");

// Location to deploy Cloud Run services
// const region = gcp.config.region || "us-central1";

const appService = new gcp.cloudrun.Service("expapp", {
  location,
  template: {
    spec: {
      containers: [
        { image: image_uri }
      ]
    }
  }
});

const appIam = new gcp.cloudrun.IamMember("expapp-everyone", {
  service: appService.name,
  location,
  role: "roles/run.invoker",
  member: "allUsers"
});

// Create a GCP resource (Storage Bucket)
// const bucket = new gcp.storage.Bucket("my-bucket", {
//     location: "US"
// });

// Exports
exports.readme = appService.status.url;
exports.url = appService.status.url;
exports.image_uri = image_uri;
exports.location = location;
// exports.region = region;
// exports.branch = branch;
// exports.sha = sha;
