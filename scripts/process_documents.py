#!/usr/bin/env python3
"""
Document processor script for the Query Support Management System.
This script processes documents in subject folders and extracts keywords.
"""

import os
import sys
import json
from pathlib import Path
import re
import shutil

# Check for required Python modules
try:
    import PyPDF2
except ImportError:
    print("Error: PyPDF2 module not found. You need to install it.")
    print("Run: pip install PyPDF2")
    sys.exit(1)

try:
    from nltk.tokenize import word_tokenize
    from nltk.corpus import stopwords
    from nltk.stem import PorterStemmer
except ImportError:
    print("Error: NLTK modules not found. You need to install them.")
    print("Run: pip install nltk")
    print("Then in Python:")
    print(">>> import nltk")
    print(">>> nltk.download('punkt')")
    print(">>> nltk.download('stopwords')")
    sys.exit(1)

import nltk
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    print("Downloading required NLTK data...")
    nltk.download('punkt')
    nltk.download('stopwords')

# Constants
SUBJECT_DIR = "subjects"
UPLOADS_DIR = "uploads"
KEYWORDS_FILE = "keywords.json"

def extract_text_from_pdf(pdf_path):
    """Extract text content from a PDF file."""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                text += reader.pages[page_num].extract_text()
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}")
    return text

def process_text(text):
    """Process extracted text to get important keywords."""
    # Tokenize
    tokens = word_tokenize(text.lower())
    
    # Remove stopwords and punctuation
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word.isalnum() and word not in stop_words and len(word) > 2]
    
    # Stem words
    stemmer = PorterStemmer()
    stemmed_tokens = [stemmer.stem(word) for word in tokens]
    
    # Count frequency
    word_freq = {}
    for word in stemmed_tokens:
        if word in word_freq:
            word_freq[word] += 1
        else:
            word_freq[word] = 1
    
    # Sort by frequency and get top keywords
    sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    top_keywords = [word for word, freq in sorted_words[:50]]
    
    return top_keywords

def ensure_directory(directory):
    """Ensure a directory exists, creating it if necessary."""
    if not os.path.exists(directory):
        os.makedirs(directory)

def copy_to_uploads(file_path, subject_name):
    """Copy a file to the uploads directory and return the new path."""
    filename = os.path.basename(file_path)
    dest_dir = os.path.join(UPLOADS_DIR, "subjects", subject_name)
    ensure_directory(dest_dir)
    
    dest_path = os.path.join(dest_dir, filename)
    shutil.copy2(file_path, dest_path)
    
    return dest_path

def process_subject_directory(subject_dir):
    """Process all PDF files in a subject directory."""
    subject_name = os.path.basename(subject_dir)
    print(f"Processing subject: {subject_name}")
    
    subject_keywords = set()
    pdf_files = [f for f in os.listdir(subject_dir) if f.lower().endswith('.pdf')]
    
    for pdf_file in pdf_files:
        pdf_path = os.path.join(subject_dir, pdf_file)
        print(f"  Processing file: {pdf_file}")
        
        # Extract and process text
        text = extract_text_from_pdf(pdf_path)
        keywords = process_text(text)
        subject_keywords.update(keywords)
        
        # Copy file to uploads directory
        uploads_path = copy_to_uploads(pdf_path, subject_name)
        print(f"  Copied to: {uploads_path}")
    
    return list(subject_keywords)

def main():
    """Main function to process all subject directories."""
    print("Starting document processing...")
    
    # Ensure required directories exist
    ensure_directory(SUBJECT_DIR)
    ensure_directory(os.path.join(UPLOADS_DIR, "subjects"))
    
    # Process each subject directory
    subject_keywords = {}
    for item in os.listdir(SUBJECT_DIR):
        subject_dir = os.path.join(SUBJECT_DIR, item)
        if os.path.isdir(subject_dir):
            keywords = process_subject_directory(subject_dir)
            subject_keywords[item] = keywords
    
    # Save keywords to JSON file
    with open(KEYWORDS_FILE, 'w') as f:
        json.dump(subject_keywords, f, indent=2)
    
    print(f"Processed {len(subject_keywords)} subjects. Keywords saved to {KEYWORDS_FILE}")
    print("Document processing completed!")

if __name__ == "__main__":
    main()