$desktop = [Environment]::GetFolderPath('Desktop')
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$desktop\ONS Studio.lnk")
$Shortcut.TargetPath = "C:\Users\njell\onseosa-agent\apps\desktop\launch.bat"
$Shortcut.WorkingDirectory = "C:\Users\njell\onseosa-agent\apps\desktop"
$Shortcut.WindowStyle = 1
$Shortcut.Description = "ONS Studio 운영실 위젯"
$Shortcut.Save()
Write-Host "바탕화면 경로: $desktop"
Write-Host "ONS Studio 바로가기 생성 완료!"
