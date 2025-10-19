param([string]$BaseUrl='https://www.esgnavigator.ai',[string]$HtmlPath='/service-map.html',[string]$JsonPath='/api/internal/uptime',[int]$TimeoutSeconds=15,[switch]$VerboseLog)
function W($c,$m){Write-Host $m -ForegroundColor $c}
function Join-Url{param([string]$b,[string]$p) return ($b.TrimEnd('/') + $p)}
Add-Type -AssemblyName System.Net.Http | Out-Null
$h=[System.Net.Http.HttpClientHandler]::new();$h.AllowAutoRedirect=$false
$c=[System.Net.Http.HttpClient]::new($h);$c.Timeout=[TimeSpan]::FromSeconds($TimeoutSeconds)
function Req($u){$r=$c.GetAsync($u).GetAwaiter().GetResult();$o=@{};foreach($x in $r.Headers){$o[$x.Key]=($x.Value -join ', ')};foreach($x in $r.Content.Headers){$o[$x.Key]=($x.Value -join ', ')}
  [PSCustomObject]@{StatusCode=[int]$r.StatusCode;ContentType=($r.Content.Headers.ContentType?.ToString() ?? '');Body=$r.Content.ReadAsStringAsync().GetAwaiter().GetResult();Headers=$o}}
if($VerboseLog){W Cyan "Base=$BaseUrl HTML=$HtmlPath JSON=$JsonPath"}
$hu=Join-Url $BaseUrl $HtmlPath;$hr=Req $hu;if($hr.StatusCode-ne 200){W Red "FAIL(HTML): $($hr.StatusCode)";exit 2}
if($hr.ContentType -notmatch '^text/html(?=;|$)'){W Red "FAIL(HTML CT): $($hr.ContentType)";exit 3}
W Green "OK(HTML): 200 $($hr.ContentType)"
$ju=Join-Url $BaseUrl $JsonPath;$jr=Req $ju;if($jr.StatusCode-ne 200){W Red "FAIL(JSON): $($jr.StatusCode)";exit 5}
if($jr.ContentType -notmatch '^application/json(?=;|$)'){W Red "FAIL(JSON CT): $($jr.ContentType)";exit 6}
try{$obj=$jr.Body | ConvertFrom-Json}catch{W Red "FAIL(JSON parse)";exit 7}
if(-not $obj.ok){W Red "FAIL(JSON ok!=true)";exit 8}
W Green "OK(JSON): 200 $($jr.ContentType)"
$from=Join-Url $BaseUrl ($JsonPath + '.js');$r=Req $from
if($r.StatusCode -in 301,302,307,308){$loc=$r.Headers['Location'];if($loc -and ($loc -eq $ju -or $loc -eq $JsonPath)){W Green "OK(REDIRECT): $from -> $loc ($($r.StatusCode))"} else {W Red "FAIL(REDIRECT Location): '$loc'";exit 9}}
else {W Red "FAIL(REDIRECT): expected 30x, got $($r.StatusCode)";exit 10}
