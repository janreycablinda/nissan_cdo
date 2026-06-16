# Deploying to a DigitalOcean Droplet

Production deploy of the containerized stack (`web` + `db` + `phpmyadmin`) behind Nginx with
HTTPS. Assumes a fresh **Ubuntu 22.04/24.04** droplet, a **domain** pointed at it, and a
**private GitHub repo** holding this project.

Replace `YOURDOMAIN.com` and `DROPLET_IP` throughout. Run commands as root (or with `sudo`).

---

## 1. DNS

Create `A` records pointing at the droplet, and wait for them to resolve:

```
YOURDOMAIN.com       A   DROPLET_IP
www.YOURDOMAIN.com   A   DROPLET_IP
```

```bash
dig +short YOURDOMAIN.com    # should print DROPLET_IP before requesting certs
```

## 2. Install Docker + firewall

```bash
ssh root@DROPLET_IP

curl -fsSL https://get.docker.com | sh        # Docker Engine + compose plugin
docker --version && docker compose version

ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

Ports 3000/3306/8080 are intentionally **not** opened — they are bound to `127.0.0.1`.

## 3. Get the code

```bash
git clone https://github.com/<you>/<repo>.git /opt/nissan
cd /opt/nissan
```

For a private repo, authenticate with a GitHub Personal Access Token when prompted, or set up
a deploy key.

## 4. Create production secrets

```bash
cp .env.example .env
# Generate values:
openssl rand -base64 48   # -> AUTH_SECRET
openssl rand -base64 18   # -> ADMIN_PASSWORD
openssl rand -base64 18   # -> DB_PASSWORD
openssl rand -base64 18   # -> DB_ROOT_PASSWORD
nano .env                 # paste them in; set ADMIN_USER if you want something other than "admin"
```

Keep a secure backup of `.env` — it is the only copy of these secrets and is git-ignored.

## 5. Build and start

```bash
docker compose up -d --build
docker compose ps                      # web, db, phpmyadmin should be Up/healthy
curl -I http://127.0.0.1:3000          # expect HTTP/1.1 200
```

MySQL seeds from `db/init.sql` on first run. (If the in-container `next build` is killed on a
1 GB droplet, add swap: `fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile
&& swapon /swapfile`, then re-run.)

## 6. Nginx reverse proxy

```bash
apt update && apt install -y nginx
cp /opt/nissan/deploy/nginx.conf /etc/nginx/sites-available/nissan
sed -i 's/YOURDOMAIN.com/your-real-domain.com/g' /etc/nginx/sites-available/nissan
ln -s /etc/nginx/sites-available/nissan /etc/nginx/sites-enabled/nissan
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

## 7. HTTPS (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d YOURDOMAIN.com -d www.YOURDOMAIN.com
systemctl status certbot.timer         # confirms auto-renewal is active
```

Visit `https://YOURDOMAIN.com` — the site should load over HTTPS.

## 8. phpMyAdmin (private, via SSH tunnel)

phpMyAdmin is not exposed publicly. From your local machine:

```bash
ssh -L 8080:127.0.0.1:8080 root@DROPLET_IP
# then browse http://localhost:8080
# login: nissan / <DB_PASSWORD>   (or root / <DB_ROOT_PASSWORD>)
```

---

## Updating the site later

```bash
cd /opt/nissan
git pull
docker compose up -d --build
```

Uploaded media persists via the `./public/images/uploads` bind mount; database data persists
in the `db_data` volume. **Never** run `docker compose down -v` in production — `-v` deletes
the database volume.

## Useful operations

```bash
docker compose logs -f web         # app logs
docker compose restart web         # restart just the app
docker compose down                # stop all (keeps data)
```
