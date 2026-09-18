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
  },

  // Check if Blog is enabled from Strapi backend or fallback config
  async isBlogEnabled() {
    // 1. Check URL query params override (?blog=1 or ?enableBlog=true)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('blog') === '1' || urlParams.get('enableBlog') === 'true' || urlParams.get('preview') === 'true') {
      return true;
    }

    // 2. Check localStorage override (allows developer/admin toggle in browser)
    if (localStorage.getItem('bnp_enable_blog') === 'true') {
      return true;
    }

    // 3. Try Strapi site-setting
    try {
      const settings = await this.getSiteSettings();
      if (settings && typeof settings.enableBlog === 'boolean') {
        return settings.enableBlog;
      }
    } catch (e) {}

    // 4. Try Strapi backend features.json
    try {
      const res = await fetch(`${STRAPI_BASE_URL}/features.json`);
      if (res.ok) {
        const data = await res.json();
        if (typeof data.enableBlog === 'boolean') return data.enableBlog;
      }
    } catch (e) {}

    // 5. Try local site config fallback
    try {
      const res2 = await fetch('/config/site-config.json');
      if (res2.ok) {
        const data2 = await res2.json();
        if (typeof data2.enableBlog === 'boolean') return data2.enableBlog;
      }
    } catch (e) {}

    return false; // Default: blog disabled/removed
  }
};

window.StrapiAPI = StrapiAPI;
