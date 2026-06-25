# Uso

[English](USAGE.md) · [Español](USAGE.es.md)

Cómo aplicar **rn-repack-aidlc** en un proyecto real. Corre estos slash commands en una sesión de Claude Code abierta sobre **la carpeta de tu app** (no sobre este repo del plugin). Instala el plugin primero — ver [README](README.es.md#instalación).

> **Invocar comandos:** van con namespace — escribe `/rn-repack-aidlc:aidlc-init` (el autocompletado tras `/` ayuda). Esta guía usa el form corto `/aidlc-init` por brevedad. Si un comando dice "Unknown command", reinicia la sesión de Claude Code para que cargue el plugin.

## Track A — App Expo existente

Aprovechas metodología + skills, **sin** Re.Pack (Expo gestionado usa Metro).

**Paso 1 — Instala las skills (una vez por máquina)**
```text
/setup-skills
```
Corre ocho `npx skills add`. Espera "success" en cada uno. Son user-level, así que no se repite por proyecto.

**Paso 2 — Inicializa AI-DLC en el proyecto**
```text
/aidlc-init app de recetas con Expo Router y Firebase
```
Crea `memory-bank/standards/` (4 archivos), genera un `CLAUDE.md` en la raíz, y te dice el siguiente paso. Luego edita `memory-bank/standards/tech-stack.md` para que diga "Expo + Metro" en vez de Re.Pack en este proyecto, y rellena los `[PROJECT]` del `CLAUDE.md`.

**Paso 3 — Elige flow según el tamaño**
```text
/spec-flow agregar pantalla de favoritos
```
Te recomienda Simple / FIRE / AI-DLC. O ve directo: `/simple-spec <cambio chico>`, `/fire <feature mediana>`, o `/aidlc-inception <feature grande>` → `/bolt-start` → `/operations`.

## Track B — Bare React Native (microfrontends con Re.Pack)

**Paso 0 — Crea/abre una app bare RN**
```bash
npx @react-native-community/cli init MiAppMF
cd MiAppMF
```

**Pasos 1–2** — iguales al Track A (`/setup-skills`, `/aidlc-init`). Aquí dejas Re.Pack en el tech-stack.

**Paso 3 — Scaffoldea Re.Pack + Module Federation**
```text
/repack-init HostApp MiniApp 8082
```
Copia las configs de host/remote y el `ScriptManager.setup.js`, reemplaza placeholders, te pide instalar `@callstack/repack` + `@rspack/core`, e imprime los comandos de arranque.

**Paso 4 — Arranca (dos terminales)**
```bash
pnpm react-native start --config rspack.config.remote.mjs --port 8082
pnpm react-native start --config rspack.config.mjs
```

**Paso 5 — Construye una feature con un flow**
```text
/aidlc-inception galería como remote federado
```
Luego `/bolt-start <primer bolt>` y `/operations build`.

## Cómo saber que va bien

| Señal | Significa |
|---|---|
| Los `/comandos` autocompletan al escribir `/` | El plugin cargó |
| `/aidlc-init` crea `memory-bank/` + `CLAUDE.md` | Init OK |
| `/setup-skills` reporta "success" ×8 | Skills instaladas |
| En la próxima sesión Claude ya "sabe" tu stack | El `CLAUDE.md` se está cargando |

## Solución de problemas

- **Un comando no aparece** → recarga la ventana; revisa en `/plugin` que `rn-repack-aidlc` esté enabled.
- **`/setup-skills` falla un `npx`** → suele ser red o falta `npx`; reintenta esa línea suelta.
- **Cualquier otro error** → abre un issue con el mensaje exacto.
