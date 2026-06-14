$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$appRoot = Join-Path $projectRoot "app"

Set-Location -LiteralPath $appRoot

if (-not (Test-Path -LiteralPath (Join-Path $appRoot "node_modules"))) {
    Write-Host "Installing TasteTrace dependencies..."
    npm install
}

Write-Host "Starting TasteTrace at http://127.0.0.1:4173"
Start-Process "http://127.0.0.1:4173"
npm run dev

