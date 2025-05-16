const natural = require('natural');
const fs = require('fs');
const pdfParse = require('pdf-parse');

// Initialize NLP components
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const TfIdf = natural.TfIdf;

// Process document to extract keywords
const processDocument = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }
    
    const fileExt = filePath.split('.').pop().toLowerCase();
    let text = '';
    
    // Extract text based on file type
    if (fileExt === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else {
      // For now, only PDF is supported
      throw new Error('Unsupported file type. Only PDF is currently supported.');
    }
    
    // Tokenize and stem text
    const tokens = tokenizer.tokenize(text.toLowerCase());
    const stemmedTokens = tokens.map(token => stemmer.stem(token));
    
    // Remove stopwords
    const stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
                      'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
                      'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
                      'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
                      'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
                      'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
                      'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
                      'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
                      'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
                      'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
                      'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
                      'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];
    
    const filteredTokens = stemmedTokens.filter(token => 
      !stopwords.includes(token) && token.length > 2);
    
    // Calculate term frequency
    const tfidf = new TfIdf();
    tfidf.addDocument(filteredTokens);
    
    // Extract top keywords
    const keywords = [];
    tfidf.listTerms(0).slice(0, 30).forEach(item => {
      keywords.push(item.term);
    });
    
    return keywords;
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
};

// Classify query text to determine subject
const classifyQuery = async (queryText, subjects) => {
  try {
    // Initialize TF-IDF
    const tfidf = new TfIdf();
    
    // Add subject keywords as documents
    subjects.forEach((subject, index) => {
      tfidf.addDocument(subject.keywords.join(' '));
    });
    
    // Tokenize and stem query
    const tokens = tokenizer.tokenize(queryText.toLowerCase());
    const stemmedQuery = tokens.map(token => stemmer.stem(token)).join(' ');
    
    // Find most similar subject
    let maxSimilarity = 0;
    let bestSubjectIndex = -1;
    
    tfidf.tfidfs(stemmedQuery, (index, measure) => {
      if (measure > maxSimilarity) {
        maxSimilarity = measure;
        bestSubjectIndex = index;
      }
    });
    
    // Return subject ID if similarity is above threshold
    if (maxSimilarity > 0.1 && bestSubjectIndex >= 0) {
      return subjects[bestSubjectIndex]._id;
    }
    
    return null;
  } catch (error) {
    console.error('Error classifying query:', error);
    throw error;
  }
};

module.exports = {
  processDocument,
  classifyQuery,
};