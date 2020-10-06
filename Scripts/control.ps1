# Check if running on macOS and set the right path
if ($PSVersionTable.OS -like 'Darwin*') {
	$mongoImport = '~/Documents/Github/Devotionals/MongoDB-tools/macOS-mongodb-tools/mongoimport'
}

$scriptList = @(
	'~/Documents/Github/Devotionals/Scripts/provo_scraper.ps1'
	'~/Documents/Github/Devotionals/Scripts/idaho_scraper.ps1'
	'~/Documents/Github/Devotionals/Scripts/hawaii_scraper.ps1'
)

# Execute each scraper script
foreach ($script in $scriptList) {
    & $script '~/Documents/Github/Devotionals/JSON'
}

# Clean up the JSON documents a little and import them into the mongo database
Get-ChildItem ./JSON | ForEach-Object {
	((Get-Content -Path $_ -Raw) -replace '&#x27;',"`'") | Set-Content -Path $_
	((Get-Content -Path $_ -Raw) -replace '&quot;',"`'") | Set-Content -Path $_
	((Get-Content -Path $_ -Raw) -replace '": ""','": null') | Set-Content -Path $_
	((Get-Content -Path $_ -Raw) -replace ([regex]'(?<="Author": ")Elder (?!and)'),'') | Set-Content -Path $_
	((Get-Content -Path $_ -Raw) -replace ([regex]'(?<="Author": ")President '),'') | Set-Content -Path $_
	((Get-Content -Path $_ -Raw) -replace ([regex]'(?<="Author": ")Brother '),'') | Set-Content -Path $_
	((Get-Content -Path $_ -Raw) -replace ([regex]'(?<="Author": ")Sister '),'') | Set-Content -Path $_
	((Get-Content -Path $_ -Raw) -replace ([regex]'\s{2,}(?=\w)'),' ') | Set-Content -Path $_

	& $mongoImport mongodb://localhost/Devotionals -c=Devotionals --type=JSON --jsonArray --file=$_
}