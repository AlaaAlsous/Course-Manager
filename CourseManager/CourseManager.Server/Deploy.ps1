$RESOURCE_GROUP="CouresManager-RG"
$APPNAME="CourseManager-App"
$NET_VERSION="net8.0"
$PUBLISH_DIR = ".\bin\Release\$NET_VERSION\publish"

$CLIENT_PATH = "..\CourseManager.Client"

$CLIENT_DIST = "$CLIENT_PATH\dist\CourseManager.Client\browser"

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

Write-Host "🧹 Cleaning backend publish folder..."
Remove-Item ".\bin\Release" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "🌐 Building Angular client..."
Set-Location $CLIENT_PATH
npm install
ng build --configuration production

Set-Location "..\CourseManager.Server"

Write-Host "📁 Copying Angular dist to backend wwwroot..."

Remove-Item ".\wwwroot" -Recurse -Force -ErrorAction SilentlyContinue

New-Item -ItemType Directory -Path ".\wwwroot" | Out-Null

Copy-Item -Path "$CLIENT_DIST\*" -Destination ".\wwwroot" -Recurse -Force

Write-Host "📦 Publishing backend..."
dotnet publish -c Release -o $PUBLISH_DIR

Write-Host "🧹 Cleaning PDB files..."
Remove-Item "$PUBLISH_DIR\*.pdb" -Force -ErrorAction SilentlyContinue

Write-Host "🗜 Creating ZIP package..."
Remove-Item "deploy.zip" -Force -ErrorAction SilentlyContinue
Compress-Archive -Path "$PUBLISH_DIR\*" -DestinationPath "deploy.zip" -Force

Write-Host "☁ Deploying to Azure..."
az webapp deployment source config-zip `
  --resource-group $RESOURCE_GROUP `
  --name $APPNAME `
  --src ".\deploy.zip"

Write-Host "🧹 Cleaning up..."
Remove-Item "deploy.zip" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Deployment complete!"
