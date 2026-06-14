# Production image for the HackSL Portal API (ASP.NET Core 8), built for
# container hosts such as Google Cloud Run.
#
# Cloud Run sends traffic to the port named by the PORT env var (default 8080)
# and terminates TLS at its proxy, so the app only needs to listen on plain
# HTTP on that port.

# --- build stage -----------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore as a separate layer so dependencies are cached across code changes.
COPY src/HackSL.Portal.Api/HackSL.Portal.Api.csproj src/HackSL.Portal.Api/
RUN dotnet restore src/HackSL.Portal.Api/HackSL.Portal.Api.csproj

# Build and publish.
COPY . .
RUN dotnet publish src/HackSL.Portal.Api/HackSL.Portal.Api.csproj \
    -c Release -o /app/publish /p:UseAppHost=false

# --- runtime stage ---------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Bind Kestrel to the port Cloud Run routes to. Cloud Run defaults to 8080.
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "HackSL.Portal.Api.dll"]
