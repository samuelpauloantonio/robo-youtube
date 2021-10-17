const {google}  = require('googleapis')
const customSearch = google.customsearch('v1')
const imageDownload = require('image-downloader')

const state = require('./state.js')
const  { apikey , searchEngineId  } = require('../credentials/google-search.json')

async function robot () {
	const content  = state.load()

	await fetchImageOfAllSentence(content)
	await downloadAllImages(content)

	state.save(content)

	


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


	async function downloadAllImages(content) {
		content.downloadedImages = []
		for(let sentenceIndex = 0; sentenceIndex < content.sentences.length ; sentenceIndex++){

			const images = content.sentences[sentenceIndex].images


			for(let imageIndex = 0 ; imageIndex < images.length; imageIndex++) {
				const imageUrl = images[imageIndex]


				try{
					if(content.downloadedImages.includes(imageUrl)){
						throw new Error('imagem ja foi baixada')
					}
					await downloadAndSaveImage(imageUrl, `${sentenceIndex}-original.png`)
					content.downloadedImages.push(imageUrl)
					break
				}
				catch(error){

					console.log(`erro ao baixar ${imageUrl}: ${error}`)
				}

			}
		}
	}


	async function downloadAndSaveImage(url, fileName) {
		return  imageDownload.image({
			url:url,
			dest:`./content/${fileName}`
		})
	}




}

module.exports = robot