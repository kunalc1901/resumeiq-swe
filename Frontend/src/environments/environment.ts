// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  base_url: 'http://localhost:4200',
  api_url: 'http://localhost:3000',
  api_url_postfix: '',
  /**
   * Cognito user pool for frontend auth (AWS Amplify - see
   * core/services/cognito.service.ts for the required pool settings).
   */
  cognito: {
    userPoolId: '',
    userPoolClientId: '',
  },
};