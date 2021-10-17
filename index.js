const readline = require('readline-sync')

const robots  = {
	input: require('./robots/input.js'),
	text: require('./robots/text.js'),
	state  :  require('./robots/state.js'),
	image: require('./robots/image.js')

}


async function start() {
	//robots.input()
	//await robots.text()
	robots.image()
	const content =  robots.state.load()

}

start()