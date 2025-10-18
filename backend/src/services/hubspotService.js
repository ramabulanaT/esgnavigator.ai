const BACKEND_API = '/api'; // dev goes via Vite proxy to 3001

class HubSpotService {
  async createContact(contactData) {
    const r = await fetch(\\/csm/enroll\, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData),
    });
    return r.json();
  }

  trackEvent(eventName, properties) {
    if (window._hsq) {
      window._hsq.push(['trackCustomBehavioralEvent', { name: eventName, properties }]);
    }
  }
}
export const hubspotService = new HubSpotService();
