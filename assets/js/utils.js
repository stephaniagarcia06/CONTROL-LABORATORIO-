/* ============================================================
   RENTELCOM - Utilidades compartidas
   ============================================================ */

const Utils = {
    /* ===== FORMATO DE MONEDA (COP) ===== */
    formatoCOP(valor) {
        if (valor === null || valor === undefined || isNaN(valor)) return '$0';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor);
    },
    
    /* Formato corto sin símbolo: 650.000 */
    formatoNumero(valor) {
        if (!valor) return '0';
        return new Intl.NumberFormat('es-CO').format(valor);
    },
    
    /* ===== FECHAS ===== */
    /* Hoy como YYYY-MM-DD (para inputs date) */
    hoy() {
        return new Date().toISOString().slice(0, 10);
    },
    
    /* Fecha larga: 15 de enero de 2026 */
    fechaLarga(fecha) {
        if (!fecha) return '-';
        const d = new Date(fecha);
        return d.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    /* Fecha corta: 15/01/2026 */
    fechaCorta(fecha) {
        if (!fecha) return '-';
        const d = new Date(fecha);
        return d.toLocaleDateString('es-CO');
    },
    
    /* Días entre dos fechas */
    diasEntre(inicio, fin) {
        const d1 = new Date(inicio);
        const d2 = new Date(fin);
        return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    },
    
    /* Añadir meses a una fecha */
    sumarMeses(fecha, meses) {
        const d = new Date(fecha);
        d.setMonth(d.getMonth() + meses);
        return d.toISOString().slice(0, 10);
    },
    
    /* ===== IVA COLOMBIA ===== */
    IVA: 0.19,
    
    calcularIVA(subtotal) {
        return Math.round(subtotal * this.IVA);
    },
    
    calcularTotalConIVA(subtotal) {
        return subtotal + this.calcularIVA(subtotal);
    },
    
    /* ===== VALIDACIONES ===== */
    esEmailValido(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    esSerialValido(serial) {
        return serial && serial.trim().length >= 3;
    },
    
    /* ===== GENERAR IDs ===== */
    generarID(prefijo = 'ID') {
        return `${prefijo}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    },
    
    /* ===== CONSECUTIVO CON PADDING ===== */
    /* Ej: generarConsecutivo(1, 5, 'ENT') → "ENT-00001" */
    generarConsecutivo(numero, padding = 3, prefijo = '') {
        const num = String(numero).padStart(padding, '0');
        return prefijo ? `${prefijo}-${num}` : num;
    },
    
    /* ===== ALERTAS ===== */
    mostrarMensaje(msg, tipo = 'success') {
        const id = tipo === 'success' ? 'mensajeExito' :
                   tipo === 'error' ? 'mensajeError' : 'mensajeWarning';
        let el = document.getElementById(id);
        
        /* Si no existe, crearlo */
        if (!el) {
            el = document.createElement('div');
            el.id = id;
            el.className = `alert-${tipo}`;
            document.body.appendChild(el);
        }
        
        el.innerText = msg;
        el.style.display = 'block';
        setTimeout(() => el.style.display = 'none', 3500);
    },
    
    /* ===== CONFIRMAR ===== */
    confirmar(mensaje) {
        return confirm(mensaje);
    },
    
    /* ===== PDF ===== */
    /* Genera HTML y lo abre en una nueva pestaña (listo para imprimir/PDF) */
    generarPDF(htmlContent, filename, logoBase64 = '') {
        const header = logoBase64 
            ? `<div style="text-align:center;margin-bottom:15px;"><img src="${logoBase64}" style="max-height:70px;"></div>`
            : '<div style="text-align:center;margin-bottom:15px;"><h2>CI RENTELCOM SAS</h2></div>';
        
        const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${filename}</title>
<style>
    body{font-family:'Segoe UI',Arial,sans-serif;padding:30px;margin:0;background:white;color:#1e293b;}
    h2,h3{color:#0a2b4e;}
    table{width:100%;border-collapse:collapse;margin:15px 0;}
    th,td{border:1px solid #ccc;padding:8px 12px;text-align:left;font-size:12px;}
    th{background:#0a2b4e;color:white;}
    .header{text-align:center;margin-bottom:20px;color:#0a2b4e;border-bottom:2px solid #0a2b4e;padding-bottom:15px;}
    .footer{text-align:center;margin-top:30px;font-size:10px;color:#666;border-top:1px solid #ccc;padding-top:15px;}
    .info-line{margin:4px 0;font-size:13px;}
    .status-badge{display:inline-block;padding:2px 12px;border-radius:20px;font-weight:bold;}
    .badge-pendiente{background:#fef3c7;color:#d97706;}
    .badge-aprobado{background:#d1fae5;color:#059669;}
    .badge-rechazado{background:#fee2e2;color:#dc2626;}
    .badge-despachado{background:#dbeafe;color:#1d4ed8;}
    .badge-disponible{background:#d1fae5;color:#059669;}
    .badge-sin-stock{background:#fee2e2;color:#dc2626;}
    .badge-bajo-stock{background:#fef3c7;color:#d97706;}
    .posicion-badge{background:#0a2b4e;color:white;padding:2px 12px;border-radius:20px;font-weight:bold;display:inline-block;}
</style>
</head>
<body>
${header}
${htmlContent}
<div class="footer">
    CI RENTELCOM SAS - Carrera 19A No. 150-50 Bogotá D.C.<br>
    Tel: 9399167 | Cel: 3185586239 | www.rentelcomcolombia.com.co
</div>
</body>
</html>`;
        
        const blob = new Blob([fullHtml], { type: 'text/html' });
        window.open(URL.createObjectURL(blob), '_blank');
    },
    
    /* ===== EXCEL ===== */
    /* Requiere XLSX (sheetjs) cargado antes */
    exportarExcel(data, nombre) {
        if (!data || data.length === 0) {
            this.mostrarMensaje(`⚠️ No hay datos para exportar en ${nombre}`, 'warning');
            return;
        }
        try {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, nombre);
            XLSX.writeFile(wb, `${nombre}_${this.hoy()}.xlsx`);
            this.mostrarMensaje(`✅ ${nombre} exportado (${data.length} registros)`);
        } catch (error) {
            this.mostrarMensaje(`❌ Error al exportar: ${error.message}`, 'error');
            console.error(error);
        }
    },
    
    /* ===== IMPORTAR EXCEL ===== */
    /* Lee archivo Excel y llama callback con filas */
    importarExcel(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet);
            callback(rows);
        };
        reader.readAsArrayBuffer(file);
    }
};

/* Alias corto para mensajes */
const msg = (txt, tipo = 'success') => Utils.mostrarMensaje(txt, tipo);
