// ============================================
// CONFIGURATION - UPDATE THESE WITH YOUR INFO
// ============================================

const CONFIG = {
    github: {
        username: 'TashanAppuhami', // Change this to your GitHub username
        token: '', // Optional: GitHub personal access token for higher rate limits
    },
    personal: {
        email: 'appuhamitashan@gmail.com',
        phone: '+1 (234) 567-8900',
        linkedin: 'https://www.linkedin.com/in/tashan-appuhami-7b2518372/',
        github: 'https://github.com/TashanAppuhami',
    },
    sampleWebsites: [
        {
            title: 'Cine Search (API Project)',
            description: 'A full-stack e-commerce platform built with React and Node.js',
            emoji: '🛍️',
            link: 'https://tashanappuhami.github.io/Film_API/',
        },
        {
            title: 'Grill Master (POS Project)',
            description: 'A productivity tool for managing daily tasks with real-time sync',
            emoji: '✓',
            link: 'https://tashanappuhami.github.io/GrillMaster_POS/',
        },
        {
            title: 'Weather Dashboard',
            description: 'Real-time weather application with interactive maps and forecasts',
            emoji: '🌤️',
            link: '#',
        },
    ],
};

// ============================================
// THEME MANAGEMENT
// ============================================

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themes = ['default', 'dark-theme', 'ocean-theme', 'forest-theme'];
        this.currentThemeIndex = 0;

        this.init();
    }

    init() {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('preferredTheme') || 'default';
        this.applyTheme(savedTheme);

        // Add click listener to toggle button
        this.themeToggle.addEventListener('click', () => this.cycleTheme());
    }

    cycleTheme() {
        this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
        const newTheme = this.themes[this.currentThemeIndex];
        this.applyTheme(newTheme);
        localStorage.setItem('preferredTheme', newTheme);
    }

    applyTheme(theme) {
        // Remove all theme classes
        this.themes.forEach((t) => document.body.classList.remove(t));

        // Add the selected theme class
        if (theme !== 'default') {
            document.body.classList.add(theme);
        }

        this.updateThemeIcon(theme);
    }

    updateThemeIcon(theme) {
        const icons = {
            default: 'fa-moon',
            'dark-theme': 'fa-sun',
            'ocean-theme': 'fa-water',
            'forest-theme': 'fa-leaf',
        };

        const iconClass = icons[theme];
        this.themeToggle.innerHTML = `<i class="fas ${iconClass}"></i>`;
    }
}

// ============================================
// GITHUB API INTEGRATION
// ============================================

class GitHubAPI {
    constructor(username, token = '') {
        this.username = username;
        this.token = token;
        this.baseUrl = 'https://api.github.com';
    }

    async getHeaders() {
        const headers = {
            Accept: 'application/vnd.github.v3+json',
        };

        if (this.token) {
            headers.Authorization = `token ${this.token}`;
        }

        return headers;
    }

    async getUserData() {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(`${this.baseUrl}/users/${this.username}`, {
                headers,
            });

            if (!response.ok) {
                throw new Error('User not found');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    }

    async getRepositories() {
        try {
            const headers = await this.getHeaders();
            const response = await fetch(
                `${this.baseUrl}/users/${this.username}/repos?sort=stars&per_page=6`,
                { headers }
            );

            if (!response.ok) {
                throw new Error('Repositories not found');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching repositories:', error);
            return [];
        }
    }
}

// ============================================
// PORTFOLIO MANAGER
// ============================================

class PortfolioManager {
    constructor() {
        this.github = new GitHubAPI(CONFIG.github.username, CONFIG.github.token);
        this.init();
    }

    async init() {
        await this.loadGitHubData();
        this.loadSampleWebsites();
        this.setupNavigation();
        this.setupHamburger();
        this.setupSmoothScroll();
    }

    async loadGitHubData() {
        try {
            // Fetch user data
            const userData = await this.github.getUserData();
            if (userData) {
                document.getElementById('githubUsername').textContent = `${userData.name || userData.login}`;
                document.getElementById('followerCount').textContent = userData.followers;
                document.getElementById('repoCount').textContent = userData.public_repos;
            }

            // Fetch repositories
            const repos = await this.github.getRepositories();
            if (repos.length > 0) {
                this.renderProjects(repos);
                document.getElementById('projectCount').textContent = repos.length;
            } else {
                this.showNoProjectsMessage();
            }
        } catch (error) {
            console.error('Error loading GitHub data:', error);
            this.showNoProjectsMessage();
        }
    }

    renderProjects(repos) {
        const projectsGrid = document.getElementById('projectsGrid');
        projectsGrid.innerHTML = '';

        repos.forEach((repo) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-card-header">
                    <div class="project-card-icon">
                        <i class="fas fa-code-branch"></i>
                    </div>
                    <div class="project-card-title">${this.escapeHtml(repo.name)}</div>
                </div>
                <div class="project-card-description">
                    ${repo.description ? this.escapeHtml(repo.description) : 'No description provided'}
                </div>
                <div class="project-card-stats">
                    <div class="project-card-stat">
                        <i class="fas fa-star"></i>
                        ${repo.stargazers_count}
                    </div>
                    <div class="project-card-stat">
                        <i class="fas fa-code-branch"></i>
                        ${repo.forks_count}
                    </div>
                    ${repo.language ? `<div class="project-card-stat"><i class="fas fa-circle"></i> ${repo.language}</div>` : ''}
                </div>
                <div class="project-card-footer">
                    <a href="${repo.html_url}" target="_blank" class="project-card-link project-card-link-primary">
                        <i class="fas fa-external-link-alt"></i>
                        View on GitHub
                    </a>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });
    }

    showNoProjectsMessage() {
        const projectsGrid = document.getElementById('projectsGrid');
        projectsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p>No repositories found. Configure your GitHub username in the config section.</p>
                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">
                    Update CONFIG.github.username in app.js with your GitHub username.
                </p>
            </div>
        `;
    }

    loadSampleWebsites() {
        const portfolioGrid = document.getElementById('portfolioGrid');
        portfolioGrid.innerHTML = '';

        CONFIG.sampleWebsites.forEach((website) => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.innerHTML = `
                <div class="portfolio-image">${website.emoji}</div>
                <div class="portfolio-content">
                    <div class="portfolio-title">${this.escapeHtml(website.title)}</div>
                    <div class="portfolio-description">${this.escapeHtml(website.description)}</div>
                    <a href="${website.link}" class="portfolio-link">View Project</a>
                </div>
            `;
            portfolioGrid.appendChild(portfolioItem);
        });
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                // Remove active class from all links
                navLinks.forEach((l) => l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');
            });
        });
    }

    setupHamburger() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    document.querySelector(href).scrollIntoView({
                        behavior: 'smooth',
                    });
                }
            });
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ============================================
// INITIALIZE APP
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    new ThemeManager();

    // Initialize portfolio manager
    new PortfolioManager();

    // Log instructions for configuration
    console.log(
        '%cPortfolio Configuration',
        'font-size: 16px; font-weight: bold; color: #6366f1;'
    );
    console.log(
        '%cUpdate the CONFIG object at the top of app.js with:',
        'color: #64748b; font-size: 14px;'
    );
    console.log('1. Your GitHub username');
    console.log('2. Your personal contact information');
    console.log('3. Your sample websites/projects');
    console.log('');
    console.log('Current configuration:', CONFIG);
});
