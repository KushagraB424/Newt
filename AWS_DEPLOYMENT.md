# Deploying Newt to AWS

This application is built as a high-performance Single Page Application (Vite + React + TypeScript) that compiles to static assets (`dist/`). It is optimized for zero-latency static hosting on AWS with CDN caching.

---

## Architecture Overview

```
[ User Browser ]
       │
       ▼
[ Amazon CloudFront (CDN + SSL) ]
       │
       ▼
[ Amazon S3 Bucket (Static Web Host) ]
```

---

## Option 1: S3 + CloudFront (Recommended for Production)

### 1. Build the Production Bundle
```bash
npm run build
```
This produces optimized production files in `dist/`.

### 2. Create S3 Bucket
```bash
# Replace 'newt-classroom-tutor-bucket' with your desired unique bucket name
aws s3 mb s3://newt-classroom-tutor-bucket --region us-east-1

# Enable static website hosting
aws s3 website s3://newt-classroom-tutor-bucket --index-document index.html --error-document index.html
```

### 3. Sync Build Files to S3
```bash
aws s3 sync dist/ s3://newt-classroom-tutor-bucket --delete
```

### 4. Create CloudFront Distribution
1. In the AWS Management Console, navigate to **CloudFront** > **Create distribution**.
2. Select your S3 bucket as the **Origin domain**.
3. Under **Default root object**, enter `index.html`.
4. In **Custom error response**:
   - HTTP error code: `403` and `404`
   - Response page path: `/index.html`
   - HTTP response code: `200` (for SPA routing).
5. Enable **Redirect HTTP to HTTPS**.
6. Deploy the distribution. You will receive a CloudFront domain name (e.g., `d1234abcd.cloudfront.net`).

---

## Option 2: AWS Amplify (Fastest 1-Click Setup)

1. Push your repository to GitHub / AWS CodeCommit / GitLab.
2. In the AWS Console, open **AWS Amplify Hosting**.
3. Choose **Host web app** and connect your repository.
4. Amplify will automatically detect Vite:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
5. Click **Save and deploy**. Amplify provides automatic SSL, global CDN, and PR preview branches.

---

## Option 3: AWS App Runner / ECS (Docker Container)

If you wish to run Newt inside a container:

### `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```
Deploy the image to **Amazon ECR** and run via **AWS App Runner** or **ECS Fargate**.
