# IPL 2026 Daily Auto-Update — Task Scheduler Setup
# Registers TWO triggers:
#   1. Every day at 8:00 AM
#   2. At every Windows logon (catches missed runs if PC was off at 8AM)
# Also sets StartWhenAvailable so any missed day is run as soon as PC is on.

$ProjectDir  = "c:\flutter_projects\Cricket"
$ScriptPath  = "$ProjectDir\daily_update.py"
$VenvPython  = "$ProjectDir\.venv\Scripts\python.exe"

# --- Find Python: prefer venv, then global ---
if (Test-Path $VenvPython) {
    $PythonExe = $VenvPython
    Write-Host "Using venv Python: $PythonExe" -ForegroundColor Green
} else {
    $PythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if ($PythonCmd) {
        $PythonExe = $PythonCmd.Source
        Write-Host "Using global Python: $PythonExe" -ForegroundColor Yellow
    } else {
        Write-Host "Python not found. Please install Python and try again." -ForegroundColor Red
        exit 1
    }
}

# --- Install required dependencies ---
Write-Host "Installing dependencies..." -ForegroundColor Cyan
& $PythonExe -m pip install requests beautifulsoup4 firebase-admin --quiet

# --- Define the action ---
$Action = New-ScheduledTaskAction `
    -Execute $PythonExe `
    -Argument "`"$ScriptPath`"" `
    -WorkingDirectory $ProjectDir

# --- TWO triggers ---
# Trigger 1: Daily at 8:00 AM
$TriggerDaily = New-ScheduledTaskTrigger -Daily -At "8:00AM"

# Trigger 2: At logon of the current user (catches missed runs)
$TriggerLogon = New-ScheduledTaskTrigger -AtLogOn -User ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name)

# --- Settings ---
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 30) `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -MultipleInstances IgnoreNew

# --- Principal (run as current user) ---
$Principal = New-ScheduledTaskPrincipal `
    -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) `
    -LogonType Interactive

# --- Register with BOTH triggers ---
Register-ScheduledTask `
    -TaskName "CricketSquadDailyUpdate" `
    -Action $Action `
    -Trigger @($TriggerDaily, $TriggerLogon) `
    -Settings $Settings `
    -Principal $Principal `
    -Description "IPL 2026 daily match status auto-updater. Runs at 8AM + on every login." `
    -Force | Out-Null

Write-Host ""
Write-Host "Automatic Update Fully Configured!" -ForegroundColor Green
Write-Host "  Trigger 1 : Every day at 8:00 AM"
Write-Host "  Trigger 2 : Every time you log into Windows"
Write-Host "  Catch-up  : Runs immediately if a previous day was missed (StartWhenAvailable)"
Write-Host "  Script    : $ScriptPath"
Write-Host "  Python    : $PythonExe"
Write-Host "  Log file  : $ProjectDir\daily_update.log"
Write-Host ""
Write-Host "No manual action needed - it will always run automatically." -ForegroundColor Cyan
