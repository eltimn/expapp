"use strict";

const pulumi = require("@pulumi/pulumi");
const gcp = require("@pulumi/gcp");

// required config values
const config = new pulumi.Config();
const branch = config.require("git_branch");
const sha = config.require("git_sha");

// Location to deploy Cloud Run services
const region = gcp.config.region || "us-central1";

// const expService = new gcp.cloudrun.Service("expapp", {
//   location,
//   template: {
//       spec: {
//           containers: [
//               { image: "gcr.io/cloudrun/hello" },
//           ],
//       },
//   },
// });

// Create a GCP resource (Storage Bucket)
const bucket = new gcp.storage.Bucket("my-bucket", {
    location: "US"
});

// Export the DNS name of the bucket
exports.bucketName = bucket.url;
exports.readme = bucket.url;
exports.region = region;
exports.branch = branch;
exports.sha = sha;
