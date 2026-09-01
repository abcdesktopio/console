# Default release is latest
ARG TAG=latest
# Default base image 
ARG BASE_IMAGE=ubuntu

FROM ${BASE_IMAGE}:${TAG} AS builder
# Automatically set by Docker buildx for multi-platform builds
ARG TARGETARCH

# define node major version to install
ENV NODE_MAJOR=20

# install npm requirements and nginx
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
        dnsutils

# install yarn npm nodejs 
RUN  mkdir -p /etc/apt/keyrings && \
     curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
     echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
     apt-get update && \
     apt-get install -y --no-install-recommends nodejs npm 

COPY app /app

# install all the required packages
WORKDIR /app
# npm < 10.5 has a known bug with optional dependencies resolution
# (https://github.com/npm/cli/issues/4828), which makes Rollup's platform-specific
# native binary (e.g. @rollup/rollup-linux-arm64-gnu) missing on some architectures,
# especially under QEMU-emulated multi-arch builds. Upgrade to the latest npm 10.x
# (fix is in 10.5.0+) rather than npm@latest, since npm 12+ requires Node >=22.
RUN npm install -g npm@10 && \
    rm -rf node_modules package-lock.json && \
    npm install

# Explicitly install the Rollup native binary for the target arch.
# npm's optional dependency resolution is unreliable under QEMU cross-compilation;
# Docker buildx sets TARGETARCH (e.g. amd64, arm64) automatically.
RUN ROLLUP_ARCH=$([ "${TARGETARCH}" = "amd64" ] && echo "x64" || echo "${TARGETARCH:-arm64}") && \
    npm install "@rollup/rollup-linux-${ROLLUP_ARCH}-gnu" --no-save 2>/dev/null || true

# build react app
RUN npm run build

# fix
RUN npm audit fix || true

#
# main image start here
# use latest nginx image
FROM nginx:alpine-slim
RUN apk update --no-cache && apk upgrade --no-cache
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
