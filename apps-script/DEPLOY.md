# Deploy Apps Script (Web App)

## 1) Preparar carpeta de deploy
Desde la raíz del repo:

```bash
cd apps-script
```

## 2) Crear o vincular proyecto
```bash
clasp login
clasp create --type standalone --title "SDMX Cotizador"
```

Si ya tienes script creado, usa:

```bash
clasp clone <SCRIPT_ID>
```

## 3) Subir código
```bash
clasp push -f
```

## 4) Versionar y desplegar
```bash
clasp version "release webapp"
clasp deploy -d "webapp prod"
```

## 5) Abrir URL
```bash
clasp deployments
```

La URL pública será:

```text
https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
```

## 6) Permisos en Editor (si te marca acceso)
En Apps Script: `Deploy > Manage deployments`:
- Execute as: `Me`
- Who has access: `Anyone`
