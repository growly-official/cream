import type { Plugin } from '@elizaos/core';
import { analyzePortfolio } from './actions/portfolio/analyzePortfolio.ts';
import { recommendTokenAction } from './actions/token/recommendTokenAction.ts';
// import { WebSearchService } from './services/tavily/index.ts';

// Export the plugin configuration
export const chainsmithPlugin: Plugin = {
  name: 'chainsmith',
  description: 'Chainsmith Plugin for Eliza',
  actions: [recommendTokenAction, analyzePortfolio],
  evaluators: [],
  providers: [],
  services: [],
};

export default chainsmithPlugin;
