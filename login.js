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

        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            loginBtn.classList.add('loading');

            const departamentoNombre = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                // 1. Intentar login de departamento
                let response = await fetch('http://localhost:3000/endpoints/loginDepartamento', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: departamentoNombre, password })
                });
                let data = await response.json();

                // 2. Si falla, intentar login de jefe
                if (!data.success || !data.usuario) {
                    response = await fetch('http://localhost:3000/endpoints/loginJefe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ usuario: departamentoNombre, password })
                    });
                    data = await response.json();
                }

                // 3. Si falla, intentar login de supervisor
                if (!data.success || !data.usuario) {
                    response = await fetch('http://localhost:3000/endpoints/loginSupervisor', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ usuario: departamentoNombre, password })
                    });
                    data = await response.json();
                }

                loginBtn.classList.remove('loading');
                if (data.success && data.usuario) {
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));
                    if (data.usuario.rol === 'usuario') {
                        window.location.href = 'Modules/Usuario/Dash-Usuario.html';
                    } else if (data.usuario.rol === 'supervisor') {
                        window.location.href = 'Modules/SupSeguridad/Dash-Supervisor.html';
                    } else if (data.usuario.rol === 'jefe') {
                        window.location.href = 'Modules/JefeSeguridad/Dash-Jefe.html';
                    } else {
                        alert('Rol no reconocido.');
                    }
                } else {
                    alert('Usuario o contraseña incorrectos');
                }
            } catch (error) {
                loginBtn.classList.remove('loading');
                alert('Error de conexión con el servidor');
            }
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