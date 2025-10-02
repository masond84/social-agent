import { DEFTPOINT_CONFIG } from './deftpoint.js';
import { TEMPLATE_CONFIG } from './template.js';

// Company registry
const COMPANIES = {
  deftpoint: DEFTPOINT_CONFIG,
  template: TEMPLATE_CONFIG
};

/**
 * Get company config by ID
 * Defaults to 'deftpoint' for backward compatibility
 */
export function getCompanyConfig(companyId = 'deftpoint') {
  const config = COMPANIES[companyId];
  
  if (!config) {
    console.warn(`⚠️ Company config '${companyId}' not found, using deftpoint as default`);
    return COMPANIES.deftpoint;
  }
  
  return config;
}

/**
 * Get system prompt for a company
 */
export function getSystemPrompt(companyId = 'deftpoint') {
  const config = getCompanyConfig(companyId);
  return config.prompts.systemPrompt;
}

/**
 * Get user prompt for a company with input
 */
export function makeUserPrompt(input, companyId = 'deftpoint') {
  const config = getCompanyConfig(companyId);
  const { topic, pillar, platform, postType } = input;
  
  // Use defaults from company config
  const finalInput = {
    topic,
    pillar: pillar || config.content.defaultPillar,
    platform: platform || config.content.defaultPlatforms,
    postType: postType || config.content.defaultPostTypes
  };
  
  return config.prompts.userPromptTemplate(finalInput);
}

/**
 * Register a new company config at runtime (for future API-based config)
 */
export function registerCompany(companyId, config) {
  COMPANIES[companyId] = config;
  console.log(`✅ Registered company config: ${companyId}`);
}

/**
 * List all available companies
 */
export function listCompanies() {
  return Object.keys(COMPANIES);
}

/**
 * Get company branding info
 */
export function getCompanyBranding(companyId = 'deftpoint') {
  const config = getCompanyConfig(companyId);
  return config.branding;
}

/**
 * Get company content defaults
 */
export function getCompanyDefaults(companyId = 'deftpoint') {
  const config = getCompanyConfig(companyId);
  return config.content;
}

export { DEFTPOINT_CONFIG, TEMPLATE_CONFIG };

