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

# Normal regex Patterns
$title_URI_Pattern = 'SpeechPromo-title">[\n\s]*.*href="(?<uri>.*)" data-cms.*>(?<title>.*)</a>'
$date_Pattern = 'SpeechPromo-date">(?<date>.*)</div>'
$authorName_Pattern = 'SpeechPromo-authorName">[\n\s]*<a.*>(?<authorName>.*)</a>'

# Patterns for JS Lectures
$JS_title_URI_Pattern = 'title promo-title ">[\n\s]*.*href="(?<uri>.*)" data-cms.*>(?<title>.*)</a>'
$JS_date_Pattern = 'ImageOnTop-date">(?<date>.*)</div>'
$JS_authorName_Pattern = 'ImageOnTop-authorName">[\n\s]*By[\n\s]*<a.*data-cms.*>(?<authorName>.*)</a>'

$devotionalsArray = @()
$exportPath = $basePath + '/hawaii.json'

# Make an array for pages to check
$devoURL = 'https://speeches.byuh.edu/devotionals?00000173-11e3-d882-a57f-33ff646d0000-page='
$commencementURL = 'https://speeches.byuh.edu/commencements?00000173-5e39-d776-ad73-7f7fe6fc0000-page='
$mcKayLectureURL = 'https://speeches.byuh.edu/david-o-mckay-lectures?00000173-5e44-d776-ad73-7f4f3f2b0000-page='
$foundationalURL = 'https://speeches.byuh.edu/foundational-speeches'
$JSlectureURL = 'https://speeches.byuh.edu/joseph-smith-lectures'
$linksArray = $devoURL, $commencementURL, $mcKayLectureURL, $foundationalURL, $JSlectureURL



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