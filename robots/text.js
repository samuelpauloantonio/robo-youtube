

const axios  = require('axios')
const senteceBoundaryDetection = require('sbd')


async function rebot(content) {
	try {
		await fetchContentFromWikipedia(content)
		sanitizeContent(content)
	breakContentIntoSentences(content)

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


}catch(error){
	console.log(error)
}
}

module.exports = rebot