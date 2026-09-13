# ==========================================
# STAGE 1: Build the React + Vite Application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Dependencies pehle copy karke install karo (Layer Caching)
COPY package*.json ./
RUN npm install

# 2. Source code copy karke production build banao
COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Lightweight Nginx Web Server
# ==========================================
FROM nginx:alpine

# 1. Stage 1 se built files (dist folder) Nginx html folder mein copy karo
COPY --from=builder /app/dist /usr/share/nginx/html

# 2. Hamara custom Nginx config copy karo (React router support ke liye)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. Port 80 open karo (Standard Web HTTP port)
EXPOSE 80

# 4. Nginx ko foreground mein chalu rakho
CMD ["nginx", "-g", "daemon off;"]
