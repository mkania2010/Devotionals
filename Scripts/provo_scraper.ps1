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
$speakerLinks = @()
$devotionalsArray = @()
$exportPath = './JSON/provo.json'

# variables for the Regex Patterns
$title_URI_Pattern = 'card__header--reduced">[\n\t]*<a href="(?<uri>.*)">(?<title>.*)<\/a>'
$date_Pattern = 'card__speech-date">(?<date>.*)</span>'
$authorName_Pattern = 'speaker-listing__name">(?<authorName>.*)</'
$authorTitle_Pattern = 'speaker-listing__position">(?<authorTitle>.*)</'
$mp3URI_Pattern = 'reduced download-links__option--(?<mp3Available>.*)"[\n\t]*(href=")?((?<mp3URI>.*).mp3" download)?[\n\t>]*AUDIO'
$videoURI_Pattern = 'href="(?<videoURI>.*)\?M=V"'


# Get links on the BYU Provo speakers page
$links = (Invoke-WebRequest -URI "https://speeches.byu.edu/speakers/").Links

# Filter the links to only the speakers' specific page
$speakerLinks = $links.href | Where-Object {$_ -like 'https://speeches.byu.edu/speakers/*'}

foreach ($speakerLink in $speakerLinks) {
	# Get the webpage
	$webpage = Invoke-RestMethod $speakerLink

	# Get all regex matches from webpage
	$titleURI_Matches = ([regex]$title_URI_Pattern).Matches($webpage)
	$date_Matches = ([regex]$date_Pattern).Matches($webpage)
	$authorName_Matches = ([regex]$authorName_Pattern).Matches($webpage)
	$authorTitle_Matches = ([regex]$authorTitle_Pattern).Matches($webpage)
	$mp3URI_Matches = ([regex]$mp3URI_Pattern).Matches($webpage)
	$videoURI_Matches = ([regex]$videoURI_Pattern).Matches($webpage)

	# Create temp array of devotionals
	$tempDevoArray = @()
	$count = 0

	# Every devo will have it's own URI, so loop through each URI on the speaker's webpage
	# $___Matches.Groups.Where{}.Value is needed to grab the useful information from the Matches table
	foreach ( $titleURI in ($titleURI_Matches.Groups.Where{$_.Name -like 'uri'}).Value ) {
		$tempDevotional = [Devotional]::new()

		# Start by assigning information that every devo SHOULD have
		$tempDevotional.DevoName = ($titleURI_Matches[$count].Groups.Where{$_.Name -like 'title'}).Value
		$tempDevotional.Author = ($authorName_Matches[0].Groups.Where{$_.Name -like 'authorName'}).Value
		$tempDevotional.Date = ($date_Matches[$count].Groups.Where{$_.Name -like 'date'}).Value
		$tempDevotional.URI = $titleURI
		$tempDevotional.Campus = 'Provo'

		# Process things that the devo may NOT have

		# Author Title - If the title is not blank, then assign it
		if (($authorTitle_Matches[0].Groups.Where{$_.Name -like 'authorTitle'}).Value -ne '') {
			$tempDevotional.AuthorTitle = ($authorTitle_Matches[0].Groups.Where{$_.Name -like 'authorTitle'}).Value
		}

		# MP3 URI - if the MP3 is not unavailable, set the URI - the '.mp3' extension must be added back as well
		if (($mp3URI_Matches[$count].Groups.Where{$_.Name -like 'mp3Available'}).Value -notlike 'unavailable') {
			$tempDevotional.MP3_URI = ($mp3URI_Matches[$count].Groups.Where{$_.Name -like 'mp3URI'}).Value + '.mp3'
		}

		# Video URI
		# set the value to null, then loop through available values to check for a match
		# if it matches, add '/?M=V' to the end, so that clicking the link plays the video
		# The regex match removes the last part of the URI, so it needs to be added back
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
Set-Content -Path $exportPath -Value $exportJson