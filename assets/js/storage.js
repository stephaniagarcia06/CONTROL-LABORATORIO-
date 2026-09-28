/* ============================================================
   RENTELCOM - Manejo de almacenamiento local
   ============================================================ */

const Storage = {
    /* Prefijo para todas las claves (evita colisiones) */
    PREFIX: 'rentelcom_',
    
    /* ===== GUARDAR ===== */
    save(key, valor) {
        try {
            const json = JSON.stringify(valor);
            localStorage.setItem(this.PREFIX + key, json);
            return true;
        } catch (error) {
            console.error(`Error guardando ${key}:`, error);
            return false;
        }
    },
    
    /* ===== LEER ===== */
    load(key, defaultValue = null) {
        try {
            const json = localStorage.getItem(this.PREFIX + key);
            return json ? JSON.parse(json) : defaultValue;
        } catch (error) {
            console.error(`Error cargando ${key}:`, error);
            return defaultValue;
        }
    },
    
    /* ===== ELIMINAR ===== */
    remove(key) {
        localStorage.removeItem(this.PREFIX + key);
    },
    
    /* ===== LIMPIAR TODO (solo RENTELCOM) ===== */
    clearAll() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(this.PREFIX));
        keys.forEach(k => localStorage.removeItem(k));
    },
    
    /* ===== INFO DE USO ===== */
    /* Retorna cuánto espacio ocupa en bytes */
    usage() {
        let total = 0;
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.PREFIX)) {
                total += localStorage[key].length;
            }
        });
        return total;
    },
    
    /* ===== EXPORTAR TODO ===== */
    /* Retorna objeto con todas las claves RENTELCOM */
    exportAll() {
        const data = {};
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.PREFIX)) {
                const realKey = key.replace(this.PREFIX, '');
                try {
                    data[realKey] = JSON.parse(localStorage[key]);
                } catch {
                    data[realKey] = localStorage[key];
                }
            }
        });
        return data;
    },
    
    /* ===== IMPORTAR TODO ===== */
    importAll(data) {
        Object.keys(data).forEach(key => {
            this.save(key, data[key]);
        });
    }
};
