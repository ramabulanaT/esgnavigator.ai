const BACKEND_API = 'https://backend-worker-production.terrymramabulana.workers.dev';

class HubSpotService {
  async createContact(contactData) {
    try {
      const response = await fetch(`${BACKEND_API}/csm/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      return await response.json();
    } catch (error) {
      console.error('Enrollment error:', error);
      throw error;
    }
  }

  trackEvent(eventName, properties) {
    if (window._hsq) {
      window._hsq.push(['trackCustomBehavioralEvent', {
        name: eventName,
        properties: properties
      }]);
    }
  }
}

export const hubspotService = new HubSpotService();