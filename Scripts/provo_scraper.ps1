# Declare the Devotional class
class Devotional {
	[string]$DevoName
	[string]$Author
	[string]$AuthorTitle
	[datetime]$Date
	[uri]$URI
	[uri]$MP3_URI
	[uri]$Video_URI
}

# Declare variables
$speakerLinks = @()
$devotionalsArray = @()

# variables for the Regex Patterns
$title_URI_Pattern = 'card__header--reduced">[\n\t]*<a href="(?<uri>.*)">(?<title>.*)<\/a>'
$date_Pattern = 'card__speech-date">(?<date>.*)</span>'
$authorName_Pattern = 'speaker-listing__name">(?<authorName>.*)</'
$authorTitle_Pattern = 'speaker-listing__position">(?<authorTitle>.*)</'
$mp3URI_Pattern = 'reduced download-links__option--(?<mp3Available>.*)"[\n\t]*(href=")?((?<mp3URI>.*).mp3" download)?[\n\t>]*AUDIO'
# $mp3Available_Pattern = 'download-links__option--(?<mp3Available>.*)"[\t\n]*.*[\t\n]*AUDIO'
$videoURI_Pattern = 'href="(?<videoURI>.*)\?M=V"'


# Get links on the BYU Provo speakers page
$links = (Invoke-WebRequest -URI "https://speeches.byu.edu/speakers/").Links

# Filter the links to only the speakers' specific page
$speakerLinks = $links.href | Where-Object {$_ -like 'https://speeches.byu.edu/speakers/*'}

foreach ($speakerLink in $speakerLinks) {
	# Get the webpage
	$webpage = Invoke-RestMethod $speakerLink

	# Testing webpage
	# $webpage = Invoke-RestMethod 'https://speeches.byu.edu/speakers/david-a-bednar/'

	# Get Regex matches
	$titleURI_Matches = ([regex]$title_URI_Pattern).Matches($webpage)
	$date_Matches = ([regex]$date_Pattern).Matches($webpage)
	$authorName_Matches = ([regex]$authorName_Pattern).Matches($webpage)
	$authorTitle_Matches = ([regex]$authorTitle_Pattern).Matches($webpage)
	$mp3URI_Matches = ([regex]$mp3URI_Pattern).Matches($webpage)
	$videoURI_Matches = ([regex]$videoURI_Pattern).Matches($webpage)

	# Create temp array of devotionals
	$tempDevoArray = @()
	$count = 0

	foreach ( $titleURI in ($titleURI_Matches.Groups.Where{$_.Name -like 'uri'}).Value ) {
		$tempDevotional = [Devotional]::new()

		# Start by assigning information that every devo SHOULD have
		$tempDevotional.DevoName = ($titleURI_Matches[$count].Groups.Where{$_.Name -like 'title'}).Value
		$tempDevotional.Author = ($authorName_Matches[0].Groups.Where{$_.Name -like 'authorName'}).Value
		$tempDevotional.Date = ($date_Matches[$count].Groups.Where{$_.Name -like 'date'}).Value`
		$tempDevotional.URI = $titleURI

		# Process things that the devo may NOT have

		# Author Title
		if (($authorTitle_Matches[0].Groups.Where{$_.Name -like 'authorTitle'}).Value -ne '') {
			$tempDevotional.AuthorTitle = ($authorTitle_Matches[0].Groups.Where{$_.Name -like 'authorTitle'}).Value
		} else {
			$tempDevotional.AuthorTitle = ''
		}

		# MP3 URI
		if (($mp3URI_Matches[$count].Groups.Where{$_.Name -like 'mp3Available'}).Value -like 'unavailable') {
			$tempDevotional.MP3_URI = ''
		} else {
			$tempDevotional.MP3_URI = ($mp3URI_Matches[$count].Groups.Where{$_.Name -like 'mp3URI'}).Value + '.mp3'
		}

		# Video URI
		# set the value to null, then loop through available values to check for a match
		# if it matches, add '/?M=V' to the end, so that clicking the link plays the video
		$tempDevotional.Video_URI = ''
		foreach ($videoURI in ($videoURI_Matches.Groups.Where{$_.Name -like 'videoURI'}).Value) {
			if ($videoURI -eq $titleURI) {
				$tempDevotional.Video_URI = $videoURI + '?M=V'
			}
		}


		$tempDevoArray += $tempDevotional
		$count++
	}

	# Add the Temp Devotional to the main array
	$devotionalsArray += $tempDevoArray

}

# Export the main array to JSON, then write it to file
$exportJson = ConvertTo-Json -InputObject $devotionalsArray
Set-Content -Path '/Users/bob/Documents/Github/Devotionals/JSON/provo.json' -Value $exportJson