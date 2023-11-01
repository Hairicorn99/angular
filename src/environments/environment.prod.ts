import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'AiProStore',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44349/',
    redirectUri: baseUrl,
    clientId: 'AiProStore_App',
    responseType: 'code',
    scope: 'offline_access AiProStore',
    requireHttps: true
  },
  apis: {
    default: {
      url: 'https://localhost:44355',
      rootNamespace: 'AiProStore',
    },
  },
} as Environment;
