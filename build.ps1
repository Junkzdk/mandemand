# Bygger dist/index.html: én fil med CSS og JS inlinet.
# Kør:  powershell -ExecutionPolicy Bypass -File .\build.ps1
$root = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding $false

$html = [IO.File]::ReadAllText("$root\index.html", $utf8)
$css  = [IO.File]::ReadAllText("$root\assets\css\style.css", $utf8)
$js   = [IO.File]::ReadAllText("$root\assets\js\main.js", $utf8)

$html = $html.Replace('<link rel="stylesheet" href="assets/css/style.css">', "<style>`n$css`n</style>")
$html = $html.Replace('<script src="assets/js/main.js"></script>', "<script>`n$js`n</script>")

New-Item -ItemType Directory -Force "$root\dist" | Out-Null
[IO.File]::WriteAllText("$root\dist\index.html", $html, $utf8)
Write-Host "Skrev dist\index.html ($([math]::Round((Get-Item "$root\dist\index.html").Length / 1KB)) KB)"
