const pulumi = require('@pulumi/pulumi');
const gcp = require('@pulumi/gcp');

// config values
const config = new pulumi.Config();
// // const branch = config.require("git_branch");
// // const sha = config.require("git_sha");
const imageUri = config.require('image_uri');
const serviceName = config.require('service_name');

// Location to deploy Cloud Run services
const region = gcp.config.region || 'us-central1';

// The cloud run service
const appService = new gcp.cloudrun.Service(serviceName, {
  location: region,
  template: {
    spec: {
      containers: [{
        image: imageUri,
        ports: [{ containerPort: 8080 }],
        resources: {
          limits: {
            cpu: '1000m',
            memory: '256Mi',
          },
        },
      }]
    },
  },
  traffics: [{ percent: 100, latestRevision: true }]
});

// allow all users access to service
new gcp.cloudrun.IamMember(`${serviceName}-all-users`, { // eslint-disable-line no-new
  service: appService.name,
  location: appService.location,
  role: 'roles/run.invoker',
  member: 'allUsers',
});

// Exports
exports.url = appService.statuses[0].url;
// exports.image_uri = image_uri;
// exports.region = region;
