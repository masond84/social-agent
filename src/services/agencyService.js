export class AgencyService {
  constructor() {
    this.agencies = new Map();
  }

  registerAgency(agencyId, config) {
    this.agencies.set(agencyId, {
      id: agencyId,
      ...config,
      createdAt: new Date(),
      isActive: true
    });
  }

  getAgency(agencyId) {
    return this.agencies.get(agencyId);
  }

  getAllAgencies() {
    return Array.from(this.agencies.values());
  }

  updateAgency(agencyId, updates) {
    const agency = this.agencies.get(agencyId);
    if (agency) {
      this.agencies.set(agencyId, { ...agency, ...updates });
      return true;
    }
    return false;
  }

  deleteAgency(agencyId) {
    return this.agencies.delete(agencyId);
  }
}