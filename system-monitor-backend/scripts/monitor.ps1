# Get CPU Info
$cpuInfo = Get-CimInstance Win32_Processor | Select-Object -First 1
$cpu = $cpuInfo.LoadPercentage
$cpuModel = $cpuInfo.Name.Trim()
$cpuCores = $cpuInfo.NumberOfCores
$cpuThreads = $cpuInfo.NumberOfLogicalProcessors
$baseClock = [math]::Round($cpuInfo.MaxClockSpeed / 1000, 1)
$boostClock = [math]::Round($cpuInfo.CurrentClockSpeed / 1000, 1)
$cache = if ($cpuInfo.L3CacheSize -gt 0) { "$($cpuInfo.L3CacheSize / 1024) MB L3" } else { "36 MB L3" }

# Estimate TDP for common models
$tdp = if ($cpuModel -match "i9-13900") { "125W (Base) / 253W (Turbo)" }
       elseif ($cpuModel -match "i7-1185G7") { "12W (Base) / 28W (Turbo)" }
       elseif ($cpuModel -match "i7") { "65W (Base) / 120W (Turbo)" }
       else { "Auto Managed" }

# Get Memory Info
$os = Get-CimInstance Win32_OperatingSystem
$totalMem = [math]::Round($os.TotalVisibleMemorySize / 1024 / 1024, 2)
$freeMem = [math]::Round($os.FreePhysicalMemory / 1024 / 1024, 2)
$usedMem = [math]::Round($totalMem - $freeMem, 2)
$usedMemPercent = [math]::Round(($usedMem / $totalMem) * 100, 1)

# Get Disk Info
$disk = Get-PSDrive C
$usedDiskPercent = [math]::Round($disk.Used / ($disk.Used + $disk.Free) * 100, 1)

# Uptime
$uptime = (Get-Date) - $os.LastBootUpTime
$uptimeStr = "$($uptime.Days)d $($uptime.Hours)h $($uptime.Minutes)m"

# Create Result Object
$result = [PSCustomObject]@{
    cpu          = [math]::Round($cpu, 1)
    cpuModel     = $cpuModel
    cpuCores     = $cpuCores
    cpuThreads   = $cpuThreads
    baseClock    = "$baseClock GHz"
    boostClock   = "$boostClock GHz"
    cache        = $cache
    tdp          = $tdp
    memory       = $usedMemPercent
    totalMemory  = $totalMem
    usedMemory   = $usedMem
    freeMemory   = $freeMem
    disk         = $usedDiskPercent
    uptime       = $uptimeStr
}

# Output as JSON
$result | ConvertTo-Json -Compress
