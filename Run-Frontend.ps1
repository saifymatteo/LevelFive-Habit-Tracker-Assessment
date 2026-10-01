Push-Location $PSScriptRoot\frontend

try {
    npm install
    npm run dev
}
finally {
    Pop-Location
}
