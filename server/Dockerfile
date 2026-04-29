# =============================================================================
# Stage 1: Dependency Resolution
# Cache Maven dependencies separately so rebuilds skip the download step
# when only source files change.
# =============================================================================
FROM maven:3.9-eclipse-temurin-21-alpine AS deps
WORKDIR /build

COPY pom.xml .
# Download all declared dependencies (and plugins) into the local cache layer
RUN mvn dependency:go-offline --no-transfer-progress -B

# =============================================================================
# Stage 2: Build
# Compile and package the application JAR.
# =============================================================================
FROM deps AS build
WORKDIR /build

COPY src ./src
RUN mvn clean package --no-transfer-progress -DskipTests \
    && mv target/*.jar target/app.jar

# =============================================================================
# Stage 3: Runtime
# Minimal JRE image — no compiler, no Maven, no source code.
# =============================================================================
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S rendoc && adduser -S rendoc -G rendoc

COPY --from=build /build/target/app.jar app.jar

# Fix ownership
RUN chown rendoc:rendoc app.jar

USER rendoc

EXPOSE 9191

# Use exec form; honour JVM env vars injected at runtime via docker-compose
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
