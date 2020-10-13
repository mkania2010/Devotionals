# Sets directory for running on my local machine or web server
if ($PSVersionTable.OS -like 'Darwin*') {
	$baseFolder = '~/Documents/Github/Devotionals/Scraper/'
	$jsonBase = $baseFolder + 'JSON/'
	$mongoImport = $baseFolder + 'MongoDB-tools/macOS-mongodb-tools/mongoimport'
}

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

# ------------------------------------------------------------------------ #
#                                                                          #
# ------------------------------------------------------------------------ #


function Hawaii_Scraper {
	# Normal regex Patterns
	$title_URI_Pattern = 'SpeechPromo-title">[\n\s]*.*href="(?<uri>.*)" data-cms.*>(?<title>.*)</a>'
	$date_Pattern = 'SpeechPromo-date">(?<date>.*)</div>'
	$authorName_Pattern = 'SpeechPromo-authorName">[\n\s]*<a.*>(?<authorName>.*)</a>'

	# Patterns for JS Lectures
	$JS_title_URI_Pattern = 'title promo-title ">[\n\s]*.*href="(?<uri>.*)" data-cms.*>(?<title>.*)</a>'
	$JS_date_Pattern = 'ImageOnTop-date">(?<date>.*)</div>'
	$JS_authorName_Pattern = 'ImageOnTop-authorName">[\n\s]*By[\n\s]*<a.*data-cms.*>(?<authorName>.*)</a>'

	$devotionalsArray = @()
	$exportPath = $jsonBase + 'hawaii.json'

	# Make an array for pages to check
	$devoURL = 'https://speeches.byuh.edu/devotionals?00000173-11e3-d882-a57f-33ff646d0000-page='
	$commencementURL = 'https://speeches.byuh.edu/commencements?00000173-5e39-d776-ad73-7f7fe6fc0000-page='
	$mcKayLectureURL = 'https://speeches.byuh.edu/david-o-mckay-lectures?00000173-5e44-d776-ad73-7f4f3f2b0000-page='
	$foundationalURL = 'https://speeches.byuh.edu/foundational-speeches'
	$JSlectureURL = 'https://speeches.byuh.edu/joseph-smith-lectures'
	$linksArray = $devoURL, $commencementURL, $mcKayLectureURL, $foundationalURL, $JSlectureURL


	# Main download loop
	foreach ($link in $linksArray) {

		# Reset page number and URL for each URL in the array
		$pageNumber = 1
		
		if ($link -like '*-page=') {
			$currentURL = $link + $pageNumber
		} else {
			$currentURL = $link
		}

		$webpage = Invoke-RestMethod -Uri $currentURL

		do {
			# Get matches from webpage - JS Lectures have their own regex patterns
			if ($link -like '*joseph-smith-lectures') {
				$titleURI_Matches = ([regex]$JS_title_URI_Pattern).Matches($webpage)
				$date_Matches = ([regex]$JS_date_Pattern).Matches($webpage)
				$authorName_Matches = ([regex]$JS_authorName_Pattern).Matches($webpage)
			} else {
				$titleURI_Matches = ([regex]$title_URI_Pattern).Matches($webpage)
				$date_Matches = ([regex]$date_Pattern).Matches($webpage)
				$authorName_Matches = ([regex]$authorName_Pattern).Matches($webpage)
			}

			$tempDevoArray = @()
			$count = 0

			# For each matched URL, assign the gathered informatino
			foreach ($titleURI in ($titleURI_Matches.Groups.Where{$_.Name -like 'uri'}).Value ) {
				$tempDevotional = [Devotional]::new()

				# Assign matches
				$tempDevotional.DevoName = ($titleURI_Matches[$count].Groups.Where{$_.Name -like 'title'}).Value
				$tempDevotional.Author = ($authorName_Matches[$count].Groups.Where{$_.Name -like 'authorName'}).Value
				$tempDevotional.Date = ($date_Matches[$count].Groups.Where{$_.Name -like 'date'}).Value
				$tempDevotional.URI = $titleURI
				$tempDevotional.Campus = 'Hawaii'

				$tempDevoArray += $tempDevotional

				$count++
			}

			# Add the temp array to the main array
			$devotionalsArray += $tempDevoArray

			#Grab next page
			$pageNumber++
			$currentWebpage = $webpage
			
			if ($link -like '*-page=') {
				$currentURL = $link + $pageNumber
			} else {
				$currentURL = $link
			}

			$webpage = Invoke-RestMethod -Uri $currentURL

			# while there is a next button on the page
		} while ($currentWebpage -like '*pagination-svg next*')
	}

	# Export to the JSON document
	$exportJson = ConvertTo-Json -InputObject $devotionalsArray
	Set-Content -Path $exportPath -Value $exportJson
}

function Idaho_Scraper {
	# Declare variables
	$devotionalsArray = @()
	$currentYear = Get-Date -Format yyyy
	$baseURL = "https://web.byui.edu/devotionalsandspeeches/api/Speeches?year="
	$exportPath = $jsonBase + 'idaho.json'

	# Main download loop
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
}

function Provo_Scraper {
	# Declare variables
	$speakerLinks = @()
	$devotionalsArray = @()
	$exportPath = $jsonBase + 'provo.json'

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

	# Main download loop
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
}


# ------------------------------------------------------------------------ #
#                                                                          #
# ------------------------------------------------------------------------ #

# Call functions
Provo_Scraper $jsonBase
Idaho_Scraper $jsonBase
Hawaii_Scraper $jsonBase

$count = 1

# Clean up the JSON documents a little and import them into the mongo database
Get-ChildItem $jsonBase | ForEach-Object {
	$item = Get-Content -Path $_ -Raw

	$item = ($item -replace ([regex]'\s{2,}(?=\w)'),' ') # replace 2 or more whitespace if a word is next
	$item = ($item -replace ([regex]'(?<="Author": ")Elder (?!and|&|[A-Za-z]+")'),'') # Remove Elder if next word is not 'and', '&', or only 1 word after
	$item = ($item -replace ([regex]'(?<="Author": ")President '),'') # Remove 'President'
	$item = ($item -replace ([regex]'(?<="Author": ")Brother '),'') # Remove 'Brother'
	$item = ($item -replace ([regex]'(?<="Author": ")Sister '),'') # Remove 'Sister'

	$item = ($item -replace '&#x27;',"'") # Remove random codes
	$item = ($item -replace '&quot;',"'")
	$item = ($item -replace '&#039;',"'")
	$item = ($item -replace '&#8220;',"'")
	$item = ($item -replace '&#8221;',"'")
	$item = ($item -replace '&#8217;',"'")

	$item = ($item -replace '&amp;',"&")
	$item = ($item -replace '&#038;',"&")

	$item = ($item -replace '&#x60;',"``") 
	$item = ($item -replace '&#8230;',"...")
	$item = ($item -replace '&#8211;',"--")

	$item = ($item -replace '": ""','": null') # Replace empty string with null
	$item = ($item -replace '": " ','": "') # Space before the String
	$item = ($item -replace ' ",','",') # Space at the end of the string

	$item | Set-Content -Path $_

	if ($count -eq 1) {
		& $mongoImport mongodb://localhost/Devotionals -c=Devotionals --type=JSON --jsonArray --file=$_ --drop
	} else {
		& $mongoImport mongodb://localhost/Devotionals -c=Devotionals --type=JSON --jsonArray --file=$_
	}

	$count++
}