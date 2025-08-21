// AdVision Dashboard JavaScript

class AdVisionDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.projects = [];
        this.theme = 'light';
        this.accentColor = 'teal';
        this.editingProjectId = null;
        
        this.init();
        this.loadData();
        this.setupEventListeners();
        
        // Delay chart setup to ensure DOM is ready
        setTimeout(() => {
            this.setupCharts();
        }, 100);
    }

    init() {
        // Load theme from localStorage if available
        const savedTheme = localStorage.getItem('advision-theme') || 'light';
        this.theme = savedTheme;
        document.documentElement.setAttribute('data-color-scheme', this.theme);
        
        // Update theme toggle icon based on current theme
        this.updateThemeToggleIcon();

        // Load accent color from localStorage if available
        const savedAccent = localStorage.getItem('advision-accent') || 'teal';
        this.accentColor = savedAccent;
        this.updateAccentColor(savedAccent);
        
        // Set initial theme radio button
        setTimeout(() => {
            const themeRadio = document.querySelector(`input[name="theme"][value="${this.theme}"]`);
            if (themeRadio) {
                themeRadio.checked = true;
            }
        }, 100);
    }

    loadData() {
        // Load projects data
        this.projects = [
            {
                id: 1,
                name: "Summer Fashion Campaign",
                client: "StyleCorp",
                budget: "$25,000",
                duration: "3 months",
                status: "active",
                progress: 65,
                startDate: "2025-06-01",
                endDate: "2025-08-31",
                description: "Multi-platform campaign for summer collection"
            },
            {
                id: 2,
                name: "Tech Product Launch",
                client: "InnovateTech",
                budget: "$50,000",
                duration: "4 months",
                status: "planning",
                progress: 25,
                startDate: "2025-09-01",
                endDate: "2025-12-31",
                description: "Comprehensive launch strategy for new product"
            },
            {
                id: 3,
                name: "Holiday Sale Promotion",
                client: "RetailPlus",
                budget: "$35,000",
                duration: "2 months",
                status: "completed",
                progress: 100,
                startDate: "2024-11-01",
                endDate: "2024-12-31",
                description: "Holiday season promotional campaigns"
            },
            {
                id: 4,
                name: "Brand Awareness Drive",
                client: "NewStart Inc",
                budget: "$18,000",
                duration: "6 months",
                status: "active",
                progress: 40,
                startDate: "2025-05-01",
                endDate: "2025-10-31",
                description: "Building brand recognition in target markets"
            }
        ];

        // Render projects after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.renderProjects();
        }, 50);
    }

    setupEventListeners() {
        // Wait for DOM to be fully ready
        setTimeout(() => {
            this.attachEventListeners();
        }, 50);
    }

    attachEventListeners() {
        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            // Remove existing listeners
            item.removeEventListener('click', this.handleNavClick);
            // Add new listener
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const section = item.getAttribute('data-section');
                console.log('Navigation clicked:', section); // Debug log
                this.showSection(section);
            });
        });

        // Sidebar toggles
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mobileToggle = document.getElementById('mobileToggle');
        const overlay = document.getElementById('overlay');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }

        if (mobileToggle) {
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.closeSidebar());
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }

        // Theme settings
        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        });

        // Accent color picker
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const color = option.getAttribute('data-color');
                this.setAccentColor(color);
            });
        });

        // Project modal
        const addProjectBtn = document.getElementById('addProjectBtn');
        const projectModal = document.getElementById('projectModal');
        const closeModal = document.getElementById('closeModal');
        const cancelModal = document.getElementById('cancelModal');
        const saveProject = document.getElementById('saveProject');

        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openProjectModal();
            });
        }

        if (closeModal) {
            closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeProjectModal();
            });
        }

        if (cancelModal) {
            cancelModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeProjectModal();
            });
        }

        if (saveProject) {
            saveProject.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveProjectForm();
            });
        }

        if (projectModal) {
            projectModal.addEventListener('click', (e) => {
                if (e.target === projectModal || e.target.classList.contains('modal-backdrop')) {
                    this.closeProjectModal();
                }
            });
        }

        // Project search and filter
        const projectSearch = document.getElementById('projectSearch');
        const statusFilter = document.getElementById('statusFilter');

        if (projectSearch) {
            projectSearch.addEventListener('input', (e) => {
                this.filterProjects(e.target.value, statusFilter?.value || '');
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterProjects(projectSearch?.value || '', e.target.value);
            });
        }

        // Generate report button
        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateReport();
            });
        }

        // Settings form
        const settingsForm = document.querySelector('.settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettings();
            });
        }

        // Window resize handler
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeSidebar();
            }
        });

        console.log('Event listeners attached'); // Debug log
    }

    showSection(sectionName) {
        console.log('Showing section:', sectionName); // Debug log
        
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('Section found and activated:', sectionName); // Debug log
        } else {
            console.log('Section not found:', sectionName); // Debug log
        }

        // Update navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        
        const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = this.capitalizeFirst(sectionName);
        }

        this.currentSection = sectionName;

        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }

        // Update URL hash
        window.location.hash = sectionName;
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        if (sidebar && overlay) {
            const isActive = sidebar.classList.contains('active');
            
            if (isActive) {
                sidebar.classList.remove('active');
                overlay.classList.add('hidden');
            } else {
                sidebar.classList.add('active');
                overlay.classList.remove('hidden');
            }
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');

        if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.add('hidden');
        }
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-color-scheme', theme);
        localStorage.setItem('advision-theme', theme);
        this.updateThemeToggleIcon();

        // Update theme radio buttons
        const themeRadio = document.querySelector(`input[name="theme"][value="${theme}"]`);
        if (themeRadio) {
            themeRadio.checked = true;
        }
    }

    updateThemeToggleIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    setAccentColor(color) {
        this.accentColor = color;
        this.updateAccentColor(color);
        localStorage.setItem('advision-accent', color);

        // Update color picker
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-color') === color);
        });
    }

    updateAccentColor(color) {
        const colorMap = {
            teal: '#218e9b',
            blue: '#3b82f6',
            purple: '#8b5cf6',
            green: '#10b981',
            orange: '#f59e0b'
        };

        const root = document.documentElement;
        if (colorMap[color]) {
            root.style.setProperty('--color-primary', colorMap[color]);
        }

        // Update active color option
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-color') === color);
        });
    }

    setupCharts() {
        this.setupRevenueChart();
        this.setupCampaignChart();
        this.setupClientChart();
    }

    setupRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [45000, 52000, 48000, 61000, 55000, 67000],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1FB8CD',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        border: {
                            display: false
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        border: {
                            display: false
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000) + 'k';
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        hoverRadius: 8
                    }
                }
            }
        });
    }

    setupCampaignChart() {
        const ctx = document.getElementById('campaignChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Social Media', 'Search Ads', 'Display', 'Video', 'Email'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    setupClientChart() {
        const ctx = document.getElementById('clientChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Client A', 'Client B', 'Client C', 'Client D', 'Client E'],
                datasets: [{
                    label: 'Performance Score',
                    data: [85, 92, 78, 88, 95],
                    backgroundColor: '#1FB8CD',
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        border: {
                            display: false
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        border: {
                            display: false
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    renderProjects(projectsToRender = null) {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;

        const projects = projectsToRender || this.projects;
        
        projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-header">
                    <div>
                        <h3 class="project-title">${project.name}</h3>
                        <p class="project-client">${project.client}</p>
                    </div>
                    <span class="project-status ${project.status}">${this.capitalizeFirst(project.status)}</span>
                </div>
                
                <div class="project-info">
                    <div class="project-info-item">
                        <span class="project-info-label">Budget</span>
                        <span class="project-info-value">${project.budget}</span>
                    </div>
                    <div class="project-info-item">
                        <span class="project-info-label">Duration</span>
                        <span class="project-info-value">${project.duration}</span>
                    </div>
                </div>
                
                <p class="project-description">${project.description}</p>
                
                <div class="project-progress">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${project.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                </div>
                
                <div class="project-actions">
                    <button class="btn-icon" onclick="window.dashboard.editProject(${project.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="window.dashboard.deleteProject(${project.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn-icon" onclick="window.dashboard.viewProject(${project.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    filterProjects(searchTerm, status) {
        let filteredProjects = this.projects;

        if (searchTerm) {
            filteredProjects = filteredProjects.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.client.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (status) {
            filteredProjects = filteredProjects.filter(project =>
                project.status === status
            );
        }

        this.renderProjects(filteredProjects);
    }

    openProjectModal(project = null) {
        const modal = document.getElementById('projectModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('projectForm');

        if (!modal || !form) return;

        if (project) {
            modalTitle.textContent = 'Edit Project';
            document.getElementById('projectName').value = project.name;
            document.getElementById('clientName').value = project.client;
            document.getElementById('projectBudget').value = project.budget;
            document.getElementById('projectDuration').value = project.duration;
            document.getElementById('projectStatus').value = project.status;
            document.getElementById('projectDescription').value = project.description;
            this.editingProjectId = project.id;
        } else {
            modalTitle.textContent = 'Add New Project';
            form.reset();
            this.editingProjectId = null;
        }

        modal.classList.remove('hidden');
    }

    closeProjectModal() {
        const modal = document.getElementById('projectModal');
        const form = document.getElementById('projectForm');

        if (modal) {
            modal.classList.add('hidden');
        }

        if (form) {
            form.reset();
        }

        this.editingProjectId = null;
    }

    saveProjectForm() {
        const projectData = {
            name: document.getElementById('projectName').value,
            client: document.getElementById('clientName').value,
            budget: document.getElementById('projectBudget').value,
            duration: document.getElementById('projectDuration').value,
            status: document.getElementById('projectStatus').value,
            description: document.getElementById('projectDescription').value
        };

        // Validate required fields
        if (!projectData.name || !projectData.client || !projectData.budget || !projectData.duration) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        if (this.editingProjectId) {
            // Update existing project
            const index = this.projects.findIndex(p => p.id == this.editingProjectId);
            if (index !== -1) {
                this.projects[index] = {
                    ...this.projects[index],
                    ...projectData
                };
            }
            this.showNotification('Project updated successfully!', 'success');
        } else {
            // Add new project
            const newProject = {
                id: Date.now(),
                ...projectData,
                progress: projectData.status === 'completed' ? 100 : 
                         projectData.status === 'active' ? 50 : 25,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
            this.projects.push(newProject);
            this.showNotification('Project created successfully!', 'success');
        }

        this.renderProjects();
        this.closeProjectModal();
    }

    editProject(projectId) {
        const project = this.projects.find(p => p.id == projectId);
        if (project) {
            this.openProjectModal(project);
        }
    }

    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.projects = this.projects.filter(p => p.id != projectId);
            this.renderProjects();
            this.showNotification('Project deleted successfully!', 'success');
        }
    }

    viewProject(projectId) {
        const project = this.projects.find(p => p.id == projectId);
        if (project) {
            this.showNotification(`Viewing details for: ${project.name}`, 'info');
        }
    }

    generateReport() {
        this.showNotification('Report generated successfully!', 'success');
        
        // Simulate report generation with some visual feedback
        const reportBtn = document.getElementById('generateReportBtn');
        if (reportBtn) {
            const originalText = reportBtn.innerHTML;
            reportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            reportBtn.disabled = true;
            
            setTimeout(() => {
                reportBtn.innerHTML = originalText;
                reportBtn.disabled = false;
            }, 2000);
        }
    }

    saveSettings() {
        this.showNotification('Settings saved successfully!', 'success');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const colorMap = {
            success: 'var(--color-success)',
            error: 'var(--color-error)',
            warning: 'var(--color-warning)',
            info: 'var(--color-info)'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background-color: var(--color-surface);
            border: 1px solid ${colorMap[type] || 'var(--color-border)'};
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            font-weight: 500;
            transition: all 0.3s ease;
            transform: translateX(400px);
            color: ${colorMap[type] || 'var(--color-text)'};
            max-width: 300px;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing dashboard...'); // Debug log
    window.dashboard = new AdVisionDashboard();
});

// Handle navigation on page load
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && ['dashboard', 'projects', 'reports', 'settings'].includes(hash)) {
        if (window.dashboard) {
            window.dashboard.showSection(hash);
        }
    }
});