const readline = require('readline-sync')

function start() {
	 const content = {}

	 content.searchTerm = askAndReturnSearchTerm()
	 content.prefix = askAndReturnPrefix() 

	 function askAndReturnSearchTerm() {
	 	return  readline.question('Type a Wikipedia search tearm: ')
	 }


	 function askAndReturnPrefix() {

	 	const prefixes  = ['Whos is', 'What is' , 'The history of']
	 	const selectPrefixIndex = readline.keyInSelect(prefixes, 'choose one option')
	 	const selectedPrefixText = prefixes[selectPrefixIndex]
	 	return selectedPrefixText
	 }
}

start()