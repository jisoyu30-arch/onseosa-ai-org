$desktop = [Environment]::GetFolderPath('Desktop')
Write-Host "Desktop path: $desktop"
Get-ChildItem $desktop | Select-Object Name | Format-Table
