# CrawlFeed

This repository contains a web crawler project designed to recursively scrape web pages starting from a seed URL. The primary goal is to collect a comprehensive list of URLs that can be used as a source for building a knowledge base for Retrieval-Augmented Generation (RAG) systems.

## Usage

The basic usage process is as follows:

1. Crawl web page content based on URLs
2. Convert web page content to Markdown format
3. Process Markdown content with embedding
4. Store embedding results in a vector database
5. Connect the vector database to an LLM (Large Language Model)

This process can effectively build a searchable knowledge base to enhance the performance and accuracy of LLMs.

## Features

- Recursive web crawling from a given seed URL
- Playwright integration for dynamic content handling
- Flexible URL processing for diverse web structures
- Compatibility with various embedders for knowledge base creation

## Project Structure

The project is organized as follows:

- `.`: Contains Playwright-related scripts and configurations
- `scan_site.spec`: the main crawler script

## Config

The configuration object for the web crawler includes the following parameters:


{
    seed: "https://eui.elastic.co/#/",  // The starting point URL for the crawler
    baseUrl: "https://eui.elastic.co",  // The base URL of the website being crawled
    outputFile: 'output.txt',  // The name of the file where results will be saved
    isValidatedURL: (url) => url && url.includes('/') && url.startsWith('#'),  // Function to determine if a URL should be recursively crawled
}

- `seed`: The initial URL from which the crawler starts its operation.
- `baseUrl`: The root URL of the website being crawled, used to resolve relative URLs.
- `outputFile`: The name of the file where the crawler will save the list of discovered URLs.
- `isValidatedURL`: A function that determines whether a given URL should be recursively crawled. It returns true if the URL is valid for further crawling.

## Objective

The main objective of this project is to:

1. Start with a seed URL
2. Recursively crawl linked pages
3. Extract relevant information from each page
4. Process and store the extracted data
5. Prepare the data for use with embedders and RAG systems

## Future Enhancements

- Integration with various embedders for knowledge representation
- Customizable crawling rules and depth limits
- Data cleaning and preprocessing pipelines
- Export functionality for different RAG system formats

## Getting Started

1. install dependencies
```
pnpm install
```

2. modify the config
```
// tests/scan_site.spec.ts
{
    seed: "https://eui.elastic.co/#/",
    baseUrl: "https://eui.elastic.co",
    outputFile: 'output.txt',
    isValidatedURL: (url) => url && url.includes('/') && url.startsWith('#'),
}

```
3. run the crawler
```
npm run test
```

4. checkk the output.txt
```
// tests/temp/output.txt
[
    "https://docs.haystack.deepset.ai/docs",
    "https://docs.haystack.deepset.ai/reference",
    ...
]
```

## Contributing

Contributions to improve and expand this web crawler are welcome. Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
