

const axios  = require('axios')
const senteceBoundaryDetection = require('sbd')
const watsonKey = require('../credentials/watson.json').apikey
const state = require('./state.js')


const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
	version: '2021-08-01',
	authenticator: new IamAuthenticator({
		apikey: `${watsonKey}`,
	}),
	serviceUrl: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com',
});




async function rebot() {
	try {

		const content = state.load()

		await fetchContentFromWikipedia(content)
		sanitizeContent(content)
		breakContentIntoSentences(content)
		await fetchKeywordOfAllSentences(content)

		state.save(content)


		async function fetchContentFromWikipedia(content) {

			const {data} =  await axios({
				method:'GET',
				url :`https://en.wikipedia.org/api/rest_v1/page/summary/${content.searchTerm}`
			})

			content.sourceContentOriginal = data.extract
		}

		function sanitizeContent (content) {
			const withoutBlankLinesAndMarkDown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)

			content.sourceContentSanitized = withoutBlankLinesAndMarkDown

			function removeBlankLinesAndMarkdown(text) {
				const allLines = text.split('\n')

				const withoutBlankLinesAndMarkDown = allLines.filter((line) => {
					if(line.trim().length === 0 || line.trim().startsWith('=') ){
						return false
					}
					return  true
				})

				return withoutBlankLinesAndMarkDown.join(' ') 
			}


		}


		function breakContentIntoSentences(content) {

			content.sentences = []
			const  sentences = senteceBoundaryDetection.sentences(content.sourceContentSanitized)

			sentences.forEach((sentence) => {
				content.sentences.push({
					text : sentence,
					keywords : [],
					images : []
				})
			})

		}


		async function fetchKeywordOfAllSentences (content) {
			for(const sentence of content.sentences ) {
				sentence.keywords = await fetchWatsonAndReturnKeyWords(sentence.text)
			}
		}

	async function fetchWatsonAndReturnKeyWords(sentence) {
	return new Promise((resolve, reject) => {
		naturalLanguageUnderstanding.analyze(
		{
			text: sentence,
			features: {
				keywords: {}
			}
		}).then(response => {
			
			const keywords = response.result.keywords.map(keyword => keyword.text)

			resolve(keywords)
		})
		.catch(err => {
			console.log('error: ', err);
		})


	})
}


	}catch(error){
		console.log(error)
	}
}

module.exports = rebot