import re

with open(r"c:\BNP RESOURCE 2\projects.html", "r", encoding="utf-8") as f:
    html = f.read()

# Extract header and footer
header_match = re.search(r'(<!DOCTYPE html>.*?</header>)', html, re.DOTALL)
footer_match = re.search(r'(<footer.*</html>)', html, re.DOTALL)

header = header_match.group(1) if header_match else ""
footer = footer_match.group(1) if footer_match else ""

# Build the detail page content
detail_content = """
  <section class="section sketch-bg sketch-bg-1" style="background: transparent; color: var(--color-secondary); padding: 180px 0 60px; position: relative; border-bottom: 1px solid var(--color-border);">
    <div class="container" style="text-align:left;">
      <a href="projects.html" style="color: var(--color-primary); display: inline-flex; align-items: center; gap: 8px; margin-bottom: 30px; font-weight: 600; font-size: 1.1rem; transition: transform 0.3s ease;" onmouseover="this.style.transform='translateX(-5px)'" onmouseout="this.style.transform='translateX(0)'">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Projects
      </a>
      <br>
      <span class="section-tag" style="color: var(--color-secondary); border-color: var(--color-secondary);" id="project-category">PORTFOLIO</span>
      <h1 id="project-title" style="color: var(--color-secondary); margin-top: 20px; margin-bottom: 25px; font-size: clamp(2.5rem, 6vw, 5.5rem); font-weight: 800; text-transform: uppercase; line-height: 1.05; letter-spacing: -0.02em;">
        Loading...
      </h1>
      <p id="project-location" style="max-width: 800px; color: var(--color-text); font-size: 1.25rem; line-height: 1.6; font-weight: 500; margin-bottom: 10px;">
        
      </p>
      <p id="project-scope" style="max-width: 800px; color: var(--color-lighter); font-size: 1.05rem; line-height: 1.6;">
        
      </p>
    </div>
  </section>

  <section class="section" style="padding-top: 80px;">
    <div class="container">
      <div id="gallery-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto;">
        <!-- Images injected here -->
      </div>
    </div>
  </section>

  <script>
    document.addEventListener("DOMContentLoaded", async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get('id');
      
      if (!projectId) {
        document.getElementById('project-title').textContent = "Project Not Found";
        return;
      }
      
      try {
        const response = await fetch('assets/js/projects-data.json');
        const data = await response.json();
        const project = data[projectId];
        
        if (!project) {
          document.getElementById('project-title').textContent = "Project Not Found";
          return;
        }
        
        document.getElementById('project-title').textContent = project.name;
        document.title = project.name + " - BNP Interiors";
        
        if (project.category) {
          document.getElementById('project-category').textContent = project.category.toUpperCase();
        } else {
          document.getElementById('project-category').style.display = 'none';
        }
        
        if (project.location) {
          document.getElementById('project-location').innerHTML = `<svg style="width:16px;height:16px;vertical-align:middle;margin-right:5px;fill:currentColor;" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>` + project.location;
        }
        
        if (project.scope) {
          document.getElementById('project-scope').textContent = "Scope: " + project.scope;
        }
        
        const galleryGrid = document.getElementById('gallery-grid');
        if (project.images && project.images.length > 0) {
          project.images.forEach((src, idx) => {
            const a = document.createElement('a');
            a.href = src;
            a.setAttribute('data-fancybox', 'gallery');
            a.style.display = 'block';
            a.style.width = '100%';
            a.style.height = '250px';
            a.style.overflow = 'hidden';
            a.style.borderRadius = '8px';
            a.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = `${project.name} - Image ${idx + 1}`;
            img.loading = 'lazy';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.transition = 'transform 0.4s ease';
            
            a.addEventListener('mouseenter', () => img.style.transform = 'scale(1.05)');
            a.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
            
            a.appendChild(img);
            galleryGrid.appendChild(a);
          });
        }
      } catch (e) {
        console.error("Error loading project data", e);
        document.getElementById('project-title').textContent = "Error Loading Project";
      }
    });
  </script>
"""

full_html = header + "\n" + detail_content + "\n" + footer

with open(r"c:\BNP RESOURCE 2\project-detail.html", "w", encoding="utf-8") as f:
    f.write(full_html)

print("Created project-detail.html")
