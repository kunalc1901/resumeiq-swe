export const environment = {
  production: true,
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
