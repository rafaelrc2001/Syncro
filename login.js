document.addEventListener('DOMContentLoaded', function() {
    // Inicializar partículas
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#00B4FF" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#007ACC", opacity: 0.3, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });

    // Animación del botón de login
    const loginBtn = document.querySelector('.login-btn');
    const loginForm = document.querySelector('.login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simular carga
        loginBtn.classList.add('loading');
        
        // Obtener credenciales
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simular autenticación (en producción sería una llamada AJAX)
        setTimeout(() => {
            loginBtn.classList.remove('loading');
            
            // Verificar credenciales y redirigir según el rol
            if (username === 'admin' && password === 'admin123') {
                // Redirigir a Crear-PT para administradores
                window.location.href = 'Modules/Usuario/CrearPT.html';
            } else if (username === 'supervisor' && password === 'supervisor123') {
                // Redirigir a SupSeguridad para supervisores
                window.location.href = 'Modules/SupSeguridad/SupSeguridad.html';
            } else if (username === 'jefe' && password === 'jefe123') {
                // Redirigir a JefeSeguridad
                window.location.href = 'Modules/JefeSeguridad/JefeSeguridad.html';
            } 
        }, 1000);
    });
    
    // Efecto hover en inputs
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('i').style.color = '#00B4FF';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.querySelector('i').style.color = '#D9D9D9';
            }
        });
    });
});