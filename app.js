// Data Configuration (same as before)
        const basePrecios = {
            barberia: { baseInst: [1500, 2500, 4000], baseMen: [250, 350, 500] },
            reparacion: { baseInst: [2500, 4000, 7000], baseMen: [300, 450, 700] },
            taller: { baseInst: [3500, 5500, 9000], baseMen: [400, 600, 950] },
            tecnico: { baseInst: [1800, 3000, 5500], baseMen: [250, 400, 650] },
            optica: { baseInst: [2000, 3500, 6000], baseMen: [300, 450, 700] },
            dentista: { baseInst: [2500, 4000, 7000], baseMen: [350, 500, 850] },
            carpinteria: { baseInst: [2500, 4000, 7000], baseMen: [300, 450, 700] },
            restaurante: { baseInst: [2500, 4000, 7500], baseMen: [300, 500, 800] },
            otro: { baseInst: [2000, 3500, 6000], baseMen: [280, 420, 650] }
        };

        const multZona = {
            sanpedro: 2.1,
            monterrey: 1.45,
            sanNicolas: 1.25,
            guadalupe: 1.08,
            apodaca: 1.08,
            escobedo: 0.95,
            juarez: 0.88,
            garcia: 0.88
        };

        const multTamano = {
            "1": 0.9,
            "2-3": 1.0,
            "4-6": 1.15,
            "7-10": 1.3,
            "10+": 1.5
        };

        const factorUrgencia = { 1: 0.95, 2: 1.0, 3: 1.08 };
        const extraPorcent = {
            portal: 0.07,
            pdf: 0.05,
            inventario: 0.09,
            dashboard: 0.08,
            fotos: 0.05,
            whatsapp: 0.05
        };

        const modulosPorGiro = {
            barberia: ['Registro de clientes', 'Agenda inteligente', 'Historial de servicios', 'Caja integrada', 'WhatsApp Business', 'Sistema de promociones'],
            reparacion: ['Base de clientes', 'Checklist de equipos', 'Folio único por orden', 'Seguimiento por estados', 'Cotización PDF', 'Panel técnico', 'Archivo digital'],
            taller: ['Registro de clientes', 'Ficha de vehículos', 'Órdenes de servicio', 'Estados de reparación', 'Control de refacciones', 'Historial mecánico', 'Panel operativo'],
            tecnico: ['Gestión de clientes', 'Solicitudes de servicio', 'Cotizaciones express', 'Agenda de visitas', 'Seguimiento en campo', 'Evidencias fotográficas'],
            optica: ['Base de pacientes', 'Control de graduación', 'Seguimiento de pedidos', 'Entregas programadas', 'Historial clínico', 'Recordatorios automáticos'],
            dentista: ['Agenda médica', 'Expediente de pacientes', 'Plan de tratamiento', 'Seguimiento post-op', 'Evidencias clínicas', 'Recordatorios de citas'],
            carpinteria: ['Solicitudes de trabajo', 'Cotizaciones detalladas', 'Avance por etapas', 'Galería de evidencias', 'Archivo de proyectos'],
            restaurante: ['Toma de pedidos', 'Caja registradora', 'Control de producción', 'Inventario básico', 'Pedidos por WhatsApp'],
            otro: ['Gestión de clientes', 'Seguimiento de tratos', 'Archivo documental', 'Comunicación WhatsApp', 'Cotizaciones']
        };

        const modulosPremium = {
            barberia: ['Dashboard analítico', 'Sistema de membresías', 'Multiusuario avanzado'],
            reparacion: ['Portal del cliente', 'Galería fotográfica', 'Dashboard técnico', 'Inventario inteligente', 'Streaming de estado'],
            taller: ['Inventario de refacciones', 'Dashboard gerencial', 'Caja avanzada', 'Multi-taller', 'Control de sucursales'],
            tecnico: ['Dashboard de rutas', 'Inventario de herramientas', 'Optimización de rutas', 'Equipos múltiples'],
            optica: ['Dashboard comercial', 'Multi-sucursal', 'Marketing automatizado'],
            dentista: ['Dashboard clínico', 'Multi-consultorio', 'Caja integrada'],
            carpinteria: ['Dashboard de proyectos', 'Inventario de materiales', 'Multi-usuario'],
            restaurante: ['Dashboard de ventas', 'Multi-caja', 'Corte automatizado'],
            otro: ['Dashboard ejecutivo', 'Multi-usuario avanzado']
        };

        // State
        let currentTier = 'ideal';

        // DOM Elements
        const giroSelect = document.getElementById('giroSelect');
        const zonaSelect = document.getElementById('zonaSelect');
        const tamanoRadios = document.getElementsByName('tamano');
        const complejidadRadios = document.getElementsByName('complejidad');
        const urgenciaSelect = document.getElementById('urgenciaSelect');
        const checkboxes = {
            portal: document.getElementById('extraPortal'),
            pdf: document.getElementById('extraPdf'),
            inventario: document.getElementById('extraInv'),
            dashboard: document.getElementById('extraDashboard'),
            fotos: document.getElementById('extraFotos'),
            whatsapp: document.getElementById('extraWhatsapp')
        };

        // Display Elements
        const instMinSpan = document.getElementById('instMin');
        const instIdealSpan = document.getElementById('instIdeal');
        const instIdealSmallSpan = document.getElementById('instIdealSmall');
        const instPremiumSpan = document.getElementById('instPremium');
        const menMinSpan = document.getElementById('menMin');
        const menIdealSpan = document.getElementById('menIdeal');
        const menPremiumSpan = document.getElementById('menPremium');
        const comisionInstSpan = document.getElementById('comisionInst');
        const comisionMenSpan = document.getElementById('comisionMen');
        const complejidadLabel = document.getElementById('complejidadLabel');
        const modulosContainer = document.getElementById('modulosContainer');
        const monthlyBar = document.getElementById('monthlyBar');
        const progressBar = document.getElementById('progressBar');

        // Hide loading after page load
        setTimeout(() => {
            document.getElementById('quantumLoading').classList.add('hidden');
        }, 1500);

        // Utility Functions
        function getSelectedRadioValue(radios) {
            for (const r of radios) if (r.checked) return r.value;
            return '2-3';
        }

        function getMultiplicadorExtras() {
            let extraMult = 1.0;
            if (checkboxes.portal.checked) extraMult += extraPorcent.portal;
            if (checkboxes.pdf.checked) extraMult += extraPorcent.pdf;
            if (checkboxes.inventario.checked) extraMult += extraPorcent.inventario;
            if (checkboxes.dashboard.checked) extraMult += extraPorcent.dashboard;
            if (checkboxes.fotos.checked) extraMult += extraPorcent.fotos;
            if (checkboxes.whatsapp.checked) extraMult += extraPorcent.whatsapp;
            return extraMult;
        }

        function redondear(valor) {
            if (valor > 5000) return Math.round(valor / 100) * 100;
            return Math.round(valor / 50) * 50;
        }

        function formatMoney(valor) {
            return valor.toLocaleString('es-MX');
        }

        function selectTier(tier) {
            currentTier = tier;
            document.querySelectorAll('.dimension-option').forEach(el => el.classList.remove('active'));
            const selected = document.querySelector(`.dimension-option[data-tier='${tier}']`);
            if (selected) selected.classList.add('active');
            actualizarCotizacion();
        }

        window.selectTier = selectTier;

        function updateProgress() {
            const filled = document.querySelectorAll('select, input:checked').length;
            const total = 9;
            const progress = Math.min((filled / total) * 100, 100);
            progressBar.style.width = progress + '%';
        }

        // Main Calculation
        function actualizarCotizacion() {
            const giro = giroSelect.value;
            const zona = zonaSelect.value;
            const tamanoKey = getSelectedRadioValue(tamanoRadios);
            const complejidadKey = getSelectedRadioValue(complejidadRadios);
            const urgenciaVal = parseInt(urgenciaSelect.value, 10);
            const factorUrg = factorUrgencia[urgenciaVal] || 1.0;

            const preciosBase = basePrecios[giro] || basePrecios.otro;
            const idx = complejidadKey === 'basico' ? 0 : (complejidadKey === 'operativo' ? 1 : 2);
            const baseInst = preciosBase.baseInst[idx];
            const baseMen = preciosBase.baseMen[idx];

            const multZ = multZona[zona] || 1.0;
            const multT = multTamano[tamanoKey] || 1.0;
            const multExtra = getMultiplicadorExtras();

            // Calculations
            const instMin = redondear(Math.round(baseInst * multZ * multT * 0.9 * factorUrg * multExtra));
            const instIdeal = redondear(Math.round(baseInst * multZ * multT * factorUrg * multExtra));
            const instPremium = redondear(Math.round(baseInst * multZ * multT * 1.4 * factorUrg * multExtra));

            const menMin = redondear(Math.round(baseMen * multZ * multT * 0.9 * factorUrg * multExtra));
            const menIdeal = redondear(Math.round(baseMen * multZ * multT * factorUrg * multExtra));
            const menPremium = redondear(Math.round(baseMen * multZ * multT * 1.4 * factorUrg * multExtra));

            // Update DOM with animation
            animateValue(instMinSpan, instMin, '$');
            animateValue(instIdealSpan, currentTier === 'min' ? instMin : currentTier === 'premium' ? instPremium : instIdeal, '');
            animateValue(instIdealSmallSpan, instIdeal, '$');
            animateValue(instPremiumSpan, instPremium, '$');

            menMinSpan.textContent = '$' + formatMoney(menMin);
            menIdealSpan.textContent = '$' + formatMoney(currentTier === 'min' ? menMin : currentTier === 'premium' ? menPremium : menIdeal) + '/mes';
            menPremiumSpan.textContent = '$' + formatMoney(menPremium);

            // Commissions
            const comisionInst = Math.round(instIdeal * 0.3);
            const comisionMen = Math.round(menIdeal * 0.1);
            animateValue(comisionInstSpan, comisionInst, '$');
            animateValue(comisionMenSpan, comisionMen, '$');

            // Labels
            const complejidadTexto = { basico: 'Básico', operativo: 'Operativo', pro: 'Pro / Enterprise' };
            complejidadLabel.textContent = complejidadTexto[complejidadKey] || 'Operativo';

            // Update badge color
            const colors = { basico: '#10b981', operativo: '#4f46e5', pro: '#f59e0b' };
            document.getElementById('complexityBadge').style.borderColor = colors[complejidadKey];
            document.getElementById('complexityBadge').style.color = colors[complejidadKey];
            document.getElementById('complexityBadge').style.background = colors[complejidadKey] + '20';

            // Progress bar
            const minPrice = menMin;
            const maxPrice = menPremium;
            const currentPrice = currentTier === 'min' ? menMin : currentTier === 'premium' ? menPremium : menIdeal;
            const percentage = ((currentPrice - minPrice) / (maxPrice - minPrice || 1)) * 100;
            monthlyBar.style.width = Math.min(Math.max(percentage, 0), 100) + '%';

            // Modules
            updateModules(giro, complejidadKey);
            updateProgress();
        }

        function animateValue(element, value, prefix) {
            const start = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
            const end = value;
            const duration = 500;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(start + (end - start) * easeProgress);

                element.textContent = prefix + formatMoney(current);

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        }

        function updateModules(giro, complejidadKey) {
            const modulosBase = modulosPorGiro[giro] || modulosPorGiro.otro;
            const modulosExtra = modulosPremium[giro] || modulosPremium.otro;

            const modulosAMostrar = [...modulosBase];

            if ((complejidadKey === 'operativo' || complejidadKey === 'pro') && modulosExtra.length > 0) {
                modulosAMostrar.push(modulosExtra[0]);
            }
            if (complejidadKey === 'pro' && modulosExtra.length > 1) {
                modulosAMostrar.push(modulosExtra[1]);
            }

            // Add extras
            if (checkboxes.portal.checked && !modulosAMostrar.some(m => m.includes('Portal')))
                modulosAMostrar.push('Portal del cliente');
            if (checkboxes.pdf.checked && !modulosAMostrar.some(m => m.includes('PDF')))
                modulosAMostrar.push('Generación PDF automática');
            if (checkboxes.inventario.checked && !modulosAMostrar.some(m => m.includes('Inventario')))
                modulosAMostrar.push('Sistema de inventario');
            if (checkboxes.dashboard.checked && !modulosAMostrar.some(m => m.includes('Dashboard')))
                modulosAMostrar.push('Dashboard ejecutivo');
            if (checkboxes.fotos.checked && !modulosAMostrar.some(m => m.includes('Evidencias')))
                modulosAMostrar.push('Evidencias fotográficas');
            if (checkboxes.whatsapp.checked && !modulosAMostrar.some(m => m.includes('WhatsApp')))
                modulosAMostrar.push('Integración WhatsApp');

            // Render
            modulosContainer.innerHTML = '';
            modulosAMostrar.slice(0, 8).forEach((mod, index) => {
                const div = document.createElement('div');
                div.className = 'module-quantum-item';
                div.style.animationDelay = (index * 0.1) + 's';
                div.innerHTML = `
                    <div class="module-check-quantum">✓</div>
                    <div style="flex: 1;">${mod}</div>
                    ${index > 5 ? '<span style="font-size: 0.7rem; padding: 0.25rem 0.75rem; background: rgba(79, 70, 229, 0.2); border-radius: 30px; color: var(--accent);">Extra</span>' : ''}
                `;
                modulosContainer.appendChild(div);
            });
        }

        // Event Listeners
        giroSelect.addEventListener('change', actualizarCotizacion);
        zonaSelect.addEventListener('change', actualizarCotizacion);
        urgenciaSelect.addEventListener('change', actualizarCotizacion);

        for (const r of tamanoRadios) r.addEventListener('change', actualizarCotizacion);
        for (const r of complejidadRadios) r.addEventListener('change', actualizarCotizacion);

        Object.values(checkboxes).forEach(cb => {
            cb.addEventListener('change', actualizarCotizacion);
        });

        // Copy Functionality
        document.getElementById('copyResumenBtn').addEventListener('click', function() {
            const giro = giroSelect.options[giroSelect.selectedIndex].text;
            const zona = zonaSelect.options[zonaSelect.selectedIndex].text.split('(')[0].trim();
            const tam = getSelectedRadioValue(tamanoRadios) + ' trabajadores';
            const comp = complejidadLabel.textContent;
            const inst = document.getElementById('instIdeal').textContent;
            const men = menIdealSpan.textContent;
            const comInst = comisionInstSpan.textContent;
            const comMen = comisionMenSpan.textContent;

            const resumen = `⚛️ *PROPUESTA CUÁNTICA SDMX* ⚛️\n\n` +
                `*Dimensión Comercial:* ${giro}\n` +
                `*Zona Dimensional:* ${zona}\n` +
                `*Tamaño Cuántico:* ${tam}\n` +
                `*Nivel Operativo:* ${comp}\n\n` +
                `💰 *Inversión Dimensional:*\n` +
                `• Instalación: $${inst}\n` +
                `• Mensualidad: ${men}\n\n` +
                `📦 *Módulos Incluidos:* ${modulosContainer.children.length} módulos especializados\n` +
                `✅ Desarrollo a la medida\n` +
                `✅ Capacitación cuántica incluida\n` +
                `✅ Soporte dimensional\n\n` +
                `Comisión explorador estimada: ${comInst} + ${comMen}/mes\n\n` +
                `¿Agendamos una demo en tu dimensión? 🌌`;

            navigator.clipboard.writeText(resumen).then(() => {
                const toast = document.getElementById('toast');
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            });
        });

        // Initialize
        actualizarCotizacion();

        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.dimensional-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(card);
        });

        // Parallax effect on orbs
        document.addEventListener('mousemove', (e) => {
            const orbs = document.querySelectorAll('.orb');
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 20;
                const x = mouseX * speed;
                const y = mouseY * speed;
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
        });