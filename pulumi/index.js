const pulumi = require('@pulumi/pulumi')
const gcp = require('@pulumi/gcp')

// config values
const config = new pulumi.Config()
// // const branch = config.require("git_branch");
// // const sha = config.require("git_sha");
const imageUri = config.require('image_uri')
const serviceName = config.require('service_name')
const domainMain = config.require('domain_main')

// Location to deploy Cloud Run services
const region = gcp.config.region || 'us-central1'

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
      }],
    },
  },
  traffics: [{ percent: 100, latestRevision: true }],
})

// allow all users access to service
new gcp.cloudrun.IamMember(`${serviceName}-all-users`, { // eslint-disable-line no-new
  service: appService.name,
  location: appService.location,
  role: 'roles/run.invoker',
  member: 'allUsers',
})

// // setup the load balancer
// const defaultManagedSslCertificate = new gcp.compute.ManagedSslCertificate('defaultManagedSslCertificate', {
//   managed: {
//     domains: ['sslcert.tf-test.club.'],
//   },
// })

// const defaultHttpHealthCheck = new gcp.compute.HttpHealthCheck('defaultHttpHealthCheck', {
//   requestPath: '/health',
//   checkIntervalSec: 1,
//   timeoutSec: 1,
// })

// const defaultBackendService = new gcp.compute.BackendService('defaultBackendService', {
//   portName: 'http',
//   protocol: 'HTTP',
//   timeoutSec: 10,
//   healthChecks: [defaultHttpHealthCheck.id],
// })

// const defaultURLMap = new gcp.compute.URLMap('defaultURLMap', {
//   description: 'Expapp URL map',
//   defaultService: defaultBackendService.id,
//   hostRules: [{
//     hosts: ['sslcert.tf-test.club'],
//     pathMatcher: 'allpaths',
//   }],
//   pathMatchers: [{
//     name: 'allpaths',
//     defaultService: defaultBackendService.id,
//     pathRules: [{
//       paths: ['/*'],
//       service: defaultBackendService.id,
//     }],
//   }],
// })

// const defaultTargetHttpsProxy = new gcp.compute.TargetHttpsProxy('defaultTargetHttpsProxy', {
//   urlMap: defaultURLMap.id,
//   sslCertificates: [defaultManagedSslCertificate.id],
// })

// const zone = new gcp.dns.ManagedZone('zone', { dnsName: 'sslcert.tf-test.club.' })
// const defaultGlobalForwardingRule = new gcp.compute.GlobalForwardingRule('defaultGlobalForwardingRule', {
//   target: defaultTargetHttpsProxy.id,
//   portRange: '443',
// })

// const set = new gcp.dns.RecordSet('set', {
//   name: 'sslcert.tf-test.club.',
//   type: 'A',
//   ttl: 3600,
//   managedZone: zone.name,
//   rrdatas: [defaultGlobalForwardingRule.ipAddress],
// })

// Exports
exports.url = appService.statuses[0].url
exports.domainMain = domainMain
// exports.image_uri = image_uri;
// exports.region = region;
