const {google}  = require('googleapis')
const customSearch = google.customsearch('v1')

const state = require('./state.js')
const  { apikey , searchEngineId  } = require('../credentials/google-search.json')

async function robot () {
	const content  = state.load()

	await fetchImageOfAllSentence(content)

	state.save(content)

	console.dir(content, {depth: null})
	process.exit(0)


	async function fetchImageOfAllSentence(content){
		for(const sentence of content.sentences){
			const query = `${content.searchTerm} ${sentence.keywords[0]}`
			console.log(query)
			sentence.images = await fetchGoogleAndReturnImageLinks(query)
		}
	}
	

	async function fetchGoogleAndReturnImageLinks(query) {

		try {
			const {data} = await customSearch.cse.list({
				auth:apikey,
				cx : searchEngineId,
				q : query,
				searchType:'image',
				num:2

			})

			if(!data.items) {
				return ['http://via.placeholder.com/640x360']
			}

			return data.items.map(item => item.link)
		}catch(error){
			console.log(error)

		}
	}




	return imagesArray


}

module.exports = robot