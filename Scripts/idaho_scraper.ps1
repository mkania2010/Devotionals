param($basePath)

# Declare the Devotional class
class Devotional {
	[string]$DevoName
	[string]$Author
	[string]$AuthorTitle
	[datetime]$Date
	[string]$Campus
	[uri]$URI
	[uri]$MP3_URI
	[uri]$Video_URI
}

# Declare variables
$devotionalsArray = @()
$currentYear = Get-Date -Format yyyy
$baseURL = "https://web.byui.edu/devotionalsandspeeches/api/Speeches?year="
$exportPath = $basePath + '/idaho.json'

foreach ($year in $currentYear..1957) {
	$url = $baseURL + $year

	# write-host $url
	try {$response = Invoke-RestMethod $url -ErrorAction SilentlyContinue} catch {}

	if ($response -ne '') {
		foreach ($devotional in $response) {
			$tempDevotional = [Devotional]::new()

			$tempDevotional.DevoName = $devotional.name
			$tempDevotional.Author = $devotional.speakerName
			$tempDevotional.Date = $devotional.date
			$tempDevotional.Campus = 'Idaho'
			
			if ($devotional.speakerPosition -ne '') {
				$tempDevotional.AuthorTitle = $devotional.speakerPosition
			}

			if ($devotional.transcriptAvailable -or $devotional.transcriptPath -ne '') {
				$tempDevotional.URI = $devotional.transcriptPath
			}

			if ($devotional.mp3Available -or $devotional.mp3Path -ne '') {
				$tempDevotional.MP3_URI = $devotional.mp3Path
			}

			if ($devotional.videoAvailable -or $devotional.videoPath -ne '') {
				$tempDevotional.Video_URI = $devotional.videoPath
			}

			$devotionalsArray += $tempDevotional
		}
	}
}

$exportJson = ConvertTo-Json -InputObject $devotionalsArray
Set-Content -Path $exportPath -Value $exportJson