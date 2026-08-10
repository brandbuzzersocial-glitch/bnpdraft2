/* ============================================================
   BNP INTERIORS – Dynamic Strapi CMS Integration API Layer
   ============================================================ */

const STRAPI_BASE_URL = window.STRAPI_URL || 'http://localhost:1337';

const StrapiAPI = {
  // Fetch site settings (logo, phone, address, social links)
  async getSiteSettings() {
    try {
      const res = await fetch(`${STRAPI_BASE_URL}/api/site-setting?populate=*`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('Strapi API offline, using static fallback content.', e);
      return null;
    }
  },

  // Fetch Hero slides
  async getHeroSlides() {
    try {
      const res = await fetch(`${STRAPI_BASE_URL}/api/hero-slides?populate=*&sort=order:asc`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch (e) {
      return null;
    }
  },

  // Fetch Services
  async getServices() {
    try {
      const res = await fetch(`${STRAPI_BASE_URL}/api/services?populate=*&sort=order:asc`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch (e) {
      return null;
    }
  },

  // Fetch Projects with category filter
  async getProjects(category = 'all') {
    try {
      let url = `${STRAPI_BASE_URL}/api/projects?populate=*&sort=createdAt:desc`;
      if (category !== 'all') {
        url += `&filters[category][$eq]=${encodeURIComponent(category)}`;
      }
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch (e) {
      return null;
    }
  },

  // Fetch Blog Posts
  async getBlogPosts() {
    try {
      const res = await fetch(`${STRAPI_BASE_URL}/api/blog-posts?populate=*&sort=publishedAt:desc`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.data;
    } catch (e) {
      return null;
    }
  },

  // Submit Contact Form
  async submitContactForm(formData) {
    try {
      const res = await fetch(`${STRAPI_BASE_URL}/api/contact-inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData })
      });
      return res.ok;
    } catch (e) {
      console.error('Contact submission error:', e);
      return false;
    }
  }
};

window.StrapiAPI = StrapiAPI;
