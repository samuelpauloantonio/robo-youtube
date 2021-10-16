const readline = require('readline-sync')

function robot() {  
	 const content = {
	 	maximumSentences:7
	 }

	 
	 content.searchTerm = askAndReturnSearchTerm()
	 content.prefix = askAndReturnPrefix() 

}
	


	 function askAndReturnSearchTerm() {
	 	return  readline.question('Type a Wikipedia search tearm: ')
	 }


	 function askAndReturnPrefix() {

	 	const prefixes  = ['Whos is', 'What is' , 'The history of']
	 	const selectPrefixIndex = readline.keyInSelect(prefixes, 'choose one option')
	 	const selectedPrefixText = prefixes[selectPrefixIndex]
	 	return selectedPrefixText
	 }


module.exports = robot