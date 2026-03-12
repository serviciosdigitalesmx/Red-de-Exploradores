(function() {
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
        barberia: ['Registro de clientes', 'Agenda / citas', 'Historial de servicios', 'Caja básica', 'WhatsApp', 'Promociones'],
        reparacion: ['Clientes', 'Equipos / checklist', 'Folio único', 'Estados / semáforo', 'Cotización PDF', 'Panel técnico', 'Archivo'],
        taller: ['Clientes', 'Vehículos', 'Órdenes de servicio', 'Estados de reparación', 'Refacciones', 'Historial', 'Panel operativo'],
        tecnico: ['Clientes', 'Solicitudes', 'Cotizaciones', 'Agenda', 'Seguimiento', 'Evidencias'],
        optica: ['Clientes', 'Graduación / pedido', 'Seguimiento', 'Entrega', 'Historial', 'Recordatorios'],
        dentista: ['Agenda', 'Pacientes', 'Tratamiento', 'Seguimiento', 'Evidencias', 'Recordatorios'],
        carpinteria: ['Solicitudes', 'Cotización', 'Avance por etapas', 'Evidencias', 'Archivo'],
        restaurante: ['Pedidos', 'Caja', 'Producción', 'Inventario básico', 'WhatsApp'],
        otro: ['Clientes', 'Seguimiento', 'Archivo', 'WhatsApp', 'Cotización']
    };

    const modulosPremium = {
        barberia: ['Dashboard', 'Membresías', 'Multiusuario'],
        reparacion: ['Portal cliente', 'Fotos', 'Dashboard', 'Inventario', 'Streaming'],
        taller: ['Inventario', 'Dashboard', 'Caja', 'Multiusuario', 'Sucursales'],
        tecnico: ['Dashboard', 'Inventario', 'Rutas', 'Multiusuario'],
        optica: ['Dashboard', 'Multiusuario', 'Recordatorios automáticos'],
        dentista: ['Dashboard', 'Multiusuario', 'Caja'],
        carpinteria: ['Dashboard', 'Inventario', 'Multiusuario'],
        restaurante: ['Dashboard', 'Multiusuario', 'Corte de caja'],
        otro: ['Dashboard', 'Multiusuario']
    };

    const giroSelect = document.getElementById('giroSelect');
    const zonaSelect = document.getElementById('zonaSelect');
    const tamanoRadios = document.getElementsByName('tamano');
    const complejidadRadios = document.getElementsByName('complejidad');
    const urgenciaSelect = document.getElementById('urgenciaSelect');
    const extraPortal = document.getElementById('extraPortal');
    const extraPdf = document.getElementById('extraPdf');
    const extraInv = document.getElementById('extraInv');
    const extraDashboard = document.getElementById('extraDashboard');
    const extraFotos = document.getElementById('extraFotos');
    const extraWhatsapp = document.getElementById('extraWhatsapp');

    const instMinSpan = document.getElementById('instMin');
    const instIdealSpan = document.getElementById('instIdeal');
    const instPremiumSpan = document.getElementById('instPremium');
    const menMinSpan = document.getElementById('menMin');
    const menIdealSpan = document.getElementById('menIdeal');
    const menPremiumSpan = document.getElementById('menPremium');
    const comisionInstSpan = document.getElementById('comisionInst');
    const comisionMenSpan = document.getElementById('comisionMen');
    const complejidadLabel = document.getElementById('complejidadLabel');
    const modulosContainer = document.getElementById('modulosContainer');

    function getSelectedRadioValue(radios) {
        for (const r of radios) if (r.checked) return r.value;
        return '2-3';
    }

    function getMultiplicadorExtras() {
        let extraMult = 1.0;
        if (extraPortal.checked) extraMult += extraPorcent.portal;
        if (extraPdf.checked) extraMult += extraPorcent.pdf;
        if (extraInv.checked) extraMult += extraPorcent.inventario;
        if (extraDashboard.checked) extraMult += extraPorcent.dashboard;
        if (extraFotos.checked) extraMult += extraPorcent.fotos;
        if (extraWhatsapp.checked) extraMult += extraPorcent.whatsapp;
        return extraMult;
    }

    function redondear(valor) {
        if (valor > 5000) return Math.round(valor / 100) * 100;
        return Math.round(valor / 50) * 50;
    }

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

        let instMin = Math.round(baseInst * multZ * multT * 0.9 * factorUrg);
        let instIdeal = Math.round(baseInst * multZ * multT * factorUrg);
        let instPremium = Math.round(baseInst * multZ * multT * 1.4 * factorUrg);

        instMin = redondear(Math.round(instMin * multExtra));
        instIdeal = redondear(Math.round(instIdeal * multExtra));
        instPremium = redondear(Math.round(instPremium * multExtra));

        let menMin = Math.round(baseMen * multZ * multT * 0.9 * factorUrg);
        let menIdeal = Math.round(baseMen * multZ * multT * factorUrg);
        let menPremium = Math.round(baseMen * multZ * multT * 1.4 * factorUrg);

        menMin = redondear(Math.round(menMin * multExtra));
        menIdeal = redondear(Math.round(menIdeal * multExtra));
        menPremium = redondear(Math.round(menPremium * multExtra));

        instMinSpan.innerText = '$' + instMin.toLocaleString('es-MX');
        instIdealSpan.innerText = '$' + instIdeal.toLocaleString('es-MX');
        instPremiumSpan.innerText = '$' + instPremium.toLocaleString('es-MX');
        menMinSpan.innerText = '$' + menMin.toLocaleString('es-MX');
        menIdealSpan.innerText = '$' + menIdeal.toLocaleString('es-MX');
        menPremiumSpan.innerText = '$' + menPremium.toLocaleString('es-MX');

        const comisionInst = Math.round(instIdeal * 0.3);
        const comisionMen = Math.round(menIdeal * 0.1);
        comisionInstSpan.innerText = '$' + comisionInst.toLocaleString('es-MX');
        comisionMenSpan.innerText = '$' + comisionMen.toLocaleString('es-MX');

        const complejidadTexto = { basico: 'Básico', operativo: 'Operativo', pro: 'Pro / especializado' };
        complejidadLabel.innerText = complejidadTexto[complejidadKey] || 'Operativo';

        const modulosBase = modulosPorGiro[giro] || modulosPorGiro.otro;
        const modulosExtra = modulosPremium[giro] || modulosPremium.otro;

        const modulosAMostrar = [...modulosBase];
        if ((complejidadKey === 'operativo' || complejidadKey === 'pro') && modulosExtra.length > 0) {
            modulosAMostrar.push(modulosExtra[0]);
        }
        if (complejidadKey === 'pro' && modulosExtra.length > 1) {
            modulosAMostrar.push(modulosExtra[1]);
        }

        if (extraPortal.checked && !modulosAMostrar.some(m => m.includes('Portal'))) modulosAMostrar.push('Portal cliente');
        if (extraPdf.checked && !modulosAMostrar.some(m => m.includes('PDF'))) modulosAMostrar.push('PDF automático');
        if (extraInv.checked && !modulosAMostrar.some(m => m.includes('Inventario'))) modulosAMostrar.push('Inventario');
        if (extraDashboard.checked && !modulosAMostrar.some(m => m.includes('Dashboard'))) modulosAMostrar.push('Dashboard');
        if (extraFotos.checked && !modulosAMostrar.some(m => m.includes('Fotos') || m.includes('Evidencias'))) modulosAMostrar.push('Evidencias');
        if (extraWhatsapp.checked && !modulosAMostrar.some(m => m.includes('WhatsApp'))) modulosAMostrar.push('WhatsApp');

        modulosContainer.innerHTML = '';
        modulosAMostrar.slice(0, 7).forEach(mod => {
            const div = document.createElement('div');
            div.className = 'modulo-sugerido';
            div.innerText = mod;
            modulosContainer.appendChild(div);
        });
    }

    giroSelect.addEventListener('change', actualizarCotizacion);
    zonaSelect.addEventListener('change', actualizarCotizacion);
    urgenciaSelect.addEventListener('change', actualizarCotizacion);

    for (const r of tamanoRadios) r.addEventListener('change', actualizarCotizacion);
    for (const r of complejidadRadios) r.addEventListener('change', actualizarCotizacion);

    [extraPortal, extraPdf, extraInv, extraDashboard, extraFotos, extraWhatsapp].forEach(cb => {
        cb.addEventListener('change', actualizarCotizacion);
    });

    document.getElementById('copyResumenBtn').addEventListener('click', function() {
        const giro = giroSelect.options[giroSelect.selectedIndex].text;
        const zona = zonaSelect.options[zonaSelect.selectedIndex].text;
        const tam = getSelectedRadioValue(tamanoRadios) + ' trabajadores';
        const comp = complejidadLabel.innerText;
        const instIdeal = instIdealSpan.innerText;
        const menIdeal = menIdealSpan.innerText;
        const comInst = comisionInstSpan.innerText;
        const comMen = comisionMenSpan.innerText;

        const resumen = `Resumen SDMX:\nNegocio: ${giro} | Zona: ${zona} | Tamaño: ${tam}\nComplejidad: ${comp}\nInstalación ideal: ${instIdeal} | Mensual ideal: ${menIdeal}\nComisión explorador: ${comInst} inst + ${comMen}/mes.\nMódulos recom: ver cotizador.`;

        navigator.clipboard.writeText(resumen).then(() => {
            alert('✅ Resumen copiado al portapapeles');
        });
    });

    actualizarCotizacion();
})();
