export const AGENCY_CONFIGS = {
  'deft-point': {
    name: 'Deft Point Consulting',
    positioning: 'Partner for non-technical founders & SMBs',
    tone: 'Technical but simplified explanations',
    caseStudies: ['GreekSpeed', 'Trailblaize'],
    cta: 'Ready to transform your idea into reality? Contact Deft Point Consulting today.',
    branding: {
      primaryColor: '#0066CC',
      logo: 'deft-point-logo.png'
    }
  },
  'default': {
    name: 'Your Agency',
    positioning: 'Your agency positioning',
    tone: 'Your tone of voice',
    caseStudies: [],
    cta: 'Ready to get started? Contact us today.',
    branding: {
      primaryColor: '#000000',
      logo: 'default-logo.png'
    }
  }
};

export function getAgencyConfig(agencyId = 'default') {
  return AGENCY_CONFIGS[agencyId] || AGENCY_CONFIGS['default'];
}

