const pulumi = require('@pulumi/pulumi')
const gcp = require('@pulumi/gcp')

// const serviceName = 'expapp'
const dnsZoneName = 'expapp-zone'

// config values
const config = new pulumi.Config()
// // const branch = config.require("git_branch");
// // const sha = config.require("git_sha");
const imageUri = config.require('image_uri')
const serviceName = config.require('service_name')
const domainMain = config.require('domain_main')

// Location to deploy to
const region = gcp.config.region || 'us-central1'

// service account to run the service as
const serviceAccount = new gcp.serviceaccount.Account(`${serviceName}-svc-acct`, {
  accountId: `${serviceName}-svc-acct`,
  displayName: `${serviceName} Service Account`,
})

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
      serviceAccountName: serviceAccount.email,
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

// setup the load balancer
const regionNetworkEndpointGroup = new gcp.compute.RegionNetworkEndpointGroup(`${serviceName}-neg`, {
  networkEndpointType: 'SERVERLESS',
  name: serviceName,
  region: appService.location,
  cloudRun: {
    service: appService.name,
  },
})

const managedSslCertificate = new gcp.compute.ManagedSslCertificate(`${serviceName}-managed-ssl`, {
  managed: {
    domains: [`${domainMain}.`],
  },
})

const backendService = new gcp.compute.BackendService(`${serviceName}-backend-service`, {
  portName: 'http',
  protocol: 'HTTP',
  loadBalancingScheme: 'EXTERNAL',
  backends: [{ group: regionNetworkEndpointGroup.id }],
})

const urlMap = new gcp.compute.URLMap(`${serviceName}-url-map`, {
  description: `${serviceName} URL map`,
  defaultService: backendService.id,
  hostRules: [{
    hosts: [domainMain],
    pathMatcher: 'allpaths',
  }],
  pathMatchers: [{
    name: 'allpaths',
    defaultService: backendService.id,
    pathRules: [{
      paths: ['/*'],
      service: backendService.id,
    }],
  }],
})

const targetHttpsProxy = new gcp.compute.TargetHttpsProxy(`${serviceName}-target-https-proxy`, {
  urlMap: urlMap.id,
  sslCertificates: [managedSslCertificate.id],
})

const globalForwardingRule = new gcp.compute.GlobalForwardingRule(`${serviceName}-global-forwarding-rule`, { // eslint-disable-line no-unused-vars
  target: targetHttpsProxy.id,
  portRange: '443',
})

const dnsZone = gcp.dns.getManagedZone({ name: dnsZoneName })

const dnsSet = new gcp.dns.RecordSet(`${serviceName}-dns-set`, { // eslint-disable-line no-unused-vars
  name: `${domainMain}.`,
  type: 'A',
  ttl: 3600,
  managedZone: dnsZone.then((zone) => zone.name),
  rrdatas: [globalForwardingRule.ipAddress],
})

// Exports
exports.url = `https://${domainMain}`
// exports.url = appService.statuses[0].url
// exports.domainMain = domainMain
// exports.ip = globalForwardingRule.ipAddress
// exports.image_uri = image_uri;
// exports.region = region;
