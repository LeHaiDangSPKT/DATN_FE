# Stage 1: Build the application
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy the source code into the container
# COPY . .
COPY public ./public
COPY src ./src
COPY .env ./
COPY next.config.js ./
COPY next-env.d.ts ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./
COPY tsconfig*.json ./

# Build your NextJS application
RUN npm run build

# Stage 2: Create a production-ready image
FROM node:lts-bookworm-slim

# Set the working directory in the container
WORKDIR /app

# Copy the production dependencies from the build stage
COPY --from=build /app/.env ./
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./
COPY --from=build /app/postcss.config.js ./
COPY --from=build /app/tailwind.config.ts ./

# Expose the port used by your NextJS application
EXPOSE 3000

# Start your NestJS application in production mode
CMD ["npm", "run", "start"]
