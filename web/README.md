# Interface web

Interface estática existente para monitorar confiança por tema. Para evoluir para quiz web:

- Consumir `data/questions/*.json` via `fetch` e montar formulários com feedback imediato.
- Manter componentes de tópicos atuais como dashboard de reforço.
- Servir localmente com um servidor simples (ex.: `python -m http.server` dentro de `web/`).

## Servindo localmente

```bash
cd web
python -m http.server 8000
```

Acesse `http://localhost:8000`.
