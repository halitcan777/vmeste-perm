#!/bin/zsh
# Выкладка сайта «Вместе» на свою ВМ (vmeste59.com): бэкап текущей версии на сервере, rsync файлов сайта, проверка.
# Запуск из папки Сайт: ./deploy_vm.sh "что поменяли". Домен и HTTPS уже настроены в Caddy (/etc/caddy/Caddyfile).
# Не уходят: .md, папки _*, qa-screens, google_apps_script, deploy-скрипты. robots.txt и noindex НЕ ставятся (это боевой адрес).
set -e
SRC="$(cd "$(dirname "$0")" && pwd)"
K=~/.ssh/vmeste_vps_ed25519; H=root@31.56.189.174; DST=/srv/vmeste/site
ssh -i $K $H "mkdir -p /srv/vmeste/backup && tar czf /srv/vmeste/backup/site_\$(date +%Y%m%d_%H%M%S).tgz -C /srv/vmeste site && ls -t /srv/vmeste/backup/*.tgz | tail -n +21 | xargs -r rm"
rsync -az --delete -e "ssh -i $K" \
  --exclude '.git' --exclude 'CNAME' --exclude '*.md' --exclude '_*' --exclude 'qa-screens' --exclude 'google_apps_script' \
  --exclude 'deploy.sh' --exclude 'deploy_vm.sh' --exclude '.DS_Store' --exclude 'robots.txt' \
  "$SRC/" "$H:$DST/"
# версия у css/js против кэша браузеров (правится на сервере, исходники чистые)
V=$(date +%d%H%M); ssh -i $K $H "cd $DST && for f in *.html; do sed -i -E 's#(site\.css|events\.js|content\.js|site\.js)(\?v=[0-9]+)?\"#\1?v=$V\"#g' \$f; done"
# robots: индексировать можно; 404 — страница сайта
ssh -i $K $H "printf 'User-agent: *\nAllow: /\nSitemap: https://vmeste59.com/sitemap.xml\n' > $DST/robots.txt && chmod -R a+rX $DST"
curl -s -o /dev/null -w "vmeste59.com: %{http_code}\n" https://vmeste59.com/
curl -s https://vmeste59.com/ | grep -oE '<title>[^<]*' | head -1
echo "Выложено на vmeste59.com (${1:-обновление})"
