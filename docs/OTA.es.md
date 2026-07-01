# Updates over-the-air (OTA) con Re.Pack

[English](OTA.md) · **Español**

Una de las capacidades estrella de Re.Pack: como Module Federation descarga **chunks remotos** de JS/bytecode Hermes en runtime, puedes enviar updates de JS reemplazando un chunk en tu CDN — **sin** una nueva submission a la App Store / Play Store. Es la feature de Re.Pack más diferenciadora del plugin.

## Por qué Re.Pack lo habilita

La app host resuelve cada chunk remoto desde una URL en runtime (vía `ScriptManager`). Actualiza el chunk (y su `mf-manifest.json`) en el CDN, y el próximo arranque descarga el código nuevo. Una app de **bundle único** no tiene nada que actualizar remotamente — OTA requiere Module Federation (host + remotes). Ver [`/repack-init`](../commands/repack-init.md).

## Qué puedes y qué no puedes enviar por OTA

| Cambio | ¿OTA? |
|---|---|
| Lógica JS/TS, UI, estilos, textos, la mayoría de bugfixes | ✅ sí — actualiza el chunk remoto |
| Assets empaquetados en un chunk | ✅ sí |
| Un módulo nativo nuevo/actualizado (Kotlin/Swift, Pods/Gradle) | ❌ no — necesita release en store |
| Upgrade de React Native / motor Hermes | ❌ no — release en store |
| Cambios a los shared singletons del host | ⚠️ riesgoso — puede romper remotes; prefiere release en store |

## Cómo funciona

```
CDN
 ├─ HostApp.container.js.bundle        (va en el binario de la store)
 └─ MiniApp/                           (actualizable por OTA)
     ├─ mf-manifest.json   ← súbelo + los chunks para publicar un update
     └─ *.chunk.bundle
Host al arrancar → ScriptManager resuelve MiniApp@<CDN>/mf-manifest.json → descarga lo último
```

## Seguridad: skew, fallback, rollout, rollback

- **Version skew:** host y remote comparten un contrato (props, shared singletons). Versiona los manifests y ata un remote a un rango de host para no servir un chunk incompatible.
- **Fallback:** siempre maneja una descarga fallida (red/CDN) — renderiza una versión cacheada o un placeholder, nunca una pantalla en blanco.
- **Rollout escalonado:** sirve el manifest nuevo a una fracción de clientes primero (routing de CDN / feature flag), vigila fallos de carga de chunks y crash rates, y luego escala.
- **Rollback:** repunta el host a la versión anterior del chunk/manifest. Conserva versiones previas en el CDN.

## Cuándo adoptarlo

Las apps v1 suelen ir en bundle único (más simple). Adopta Module Federation + OTA cuando quieras empujar fixes/contenido entre releases de store, o cuando equipos independientes sean dueños de features. Corre `/repack-init` para tallar el primer remote, y registra el plan de hosting/rollback OTA en `memory-bank/operations/`.

## Nota sobre políticas de las stores

Las stores permiten updates de JS que arreglan bugs o ajustan contenido, pero **no** updates que cambien el propósito central de la app o esquiven la revisión. Mantén OTA dentro de política — trátalo como iteración rápida, no como forma de enviar lo que la revisión rechazaría.
