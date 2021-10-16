const readline = require('readline-sync')

const robots  = {
	text: require('./robots/text.js')
}


async function start() {
	 const content = {}

	 content.searchTerm = await askAndReturnSearchTerm()
	 content.prefix = await askAndReturnPrefix() 


	 async function askAndReturnSearchTerm() {
	 	return await readline.question('Type a Wikipedia search tearm: ')
	 }


	 async function askAndReturnPrefix() {

	 	const prefixes  = ['Whos is', 'What is' , 'The history of']
	 	const selectPrefixIndex = readline.keyInSelect(prefixes, 'choose one option')
	 	const selectedPrefixText = prefixes[selectPrefixIndex]
	 	
	 	return selectedPrefixText
	 }
	 robots.text(content)
}

start()