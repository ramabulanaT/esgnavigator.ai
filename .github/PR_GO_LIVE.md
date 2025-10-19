# Go Live: ESG Navigator (Vercel + Railway)

## Summary
Production hardening, health visibility, and CI checks to ensure uptime:
- ✅ Railway API skeleton (`railway-api/`) with `/health`, `/api/version`, `POST /api/internal/echo`, CORS
- ✅ Vercel Edge: `/api/internal/uptime`, `/api/internal/status`
- ✅ Diagnostics pages: `/diagnostics.html`, `/service-map.html`
- ✅ App UX: HealthBanner (only shows on failures), StatusBadge
- ✅ CI: post-deploy health, hourly status, 15-min keepalive; Slack optional via `SLACK_WEBHOOK_URL`

## Verify
- Web: https://esgnavigator-ai.vercel.app
- Status: `/api/internal/status`
- Diagnostics: `/diagnostics.html`
- Service Map: `/service-map.html`

## Checklist
- [ ] Railway deployed (Root: `railway-api`)
- [ ] `NEXT_PUBLIC_API_URL` set to Railway URL (no trailing slash)
- [ ] CORS allows Vercel alias (`esgnavigator-ai.vercel.app`)
- [ ] Diagnostics green, echo POST works

