function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const isDark = document.body.classList.toggle('dark-theme');
        const theme = isDark ? 'dark' : 'light';
        
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeToggle.title = 'Переключить на светлую тему';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeToggle.title = 'Переключить на темную тему';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
});