// ISO 50001 API Service - connects to your Cloudflare Worker
const API_BASE = 'https://backend-worker-production.terrymramabulana.workers.dev';

class ISO50001ApiService {
  async getTemplate() {
    try {
      const response = await fetch(`${API_BASE}/iso50001/template`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  }

  async createAssessment(assessmentData) {
    try {
      const response = await fetch(`${API_BASE}/iso50001/assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }

  async submitAnswers(answers) {
    try {
      const response = await fetch(`${API_BASE}/iso50001/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting answers:', error);
      throw error;
    }
  }

  async getScore(assessmentId) {
    try {
      const response = await fetch(`${API_BASE}/iso50001/score/${assessmentId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching score:', error);
      throw error;
    }
  }

  async getHealth() {
    try {
      const response = await fetch(`${API_BASE}/api/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }
}

export const iso50001Api = new ISO50001ApiService();