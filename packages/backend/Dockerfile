# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.15.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

ENV NODE_ENV=production
ENV PAKE_MAN_PRISMA_DATABASE_URL=file:/usr/src/pake-man/data/pake-man.db

# Set working directory for all build stages.
WORKDIR /usr/src/pake-man

################################################################################
# Create a stage for installing production dependecies.
FROM base AS deps

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Create a stage for building the application.
FROM deps AS build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

# Copy the rest of the source files into the image.
COPY . .

# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base AS final

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Mount the directory with all the database files so it can be persisted.
VOLUME ["/usr/src/pake-man/data"]

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/pake-man/node_modules ./node_modules
COPY --from=build /usr/src/pake-man/dist ./dist
COPY --from=build --chown=node /usr/src/pake-man/data ./data

# Expose the port that the application listens on.
EXPOSE 3000

STOPSIGNAL SIGQUIT

# Run the application.
ENTRYPOINT ["node", "dist/server.js"]
