Push-Location $PSScriptRoot

try {
    # Ensure DB instance is running with Docker
    docker compose down; docker compose -f .\docker-compose.db.yml up -d

    # Install dependencies
    Set-Location .\backend
    pip install --no-cache-dir -r requirements.txt

    # Expand local .env
    if (Test-Path "./.env") {
      Get-Content "./.env" | ForEach-Object {
        $key, $value = $_ -split '=', 2
        [Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim().Trim('"'), 'Process')
      }
      Write-Host "Loaded env from .env"
    }
    else {
      Write-Warning "No .env found - built-in default points at host 'db', which only resolves inside Docker"
    }

    # Run the backend
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
}
finally {
    Pop-Location
}
