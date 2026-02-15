// Web search tool using Tavily API
export async function searchWeb(query: string): Promise<{
    results: Array<{
        title: string;
        url: string;
        content: string;
        score: number;
    }>;
    error?: string;
}> {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey || apiKey === 'your_tavily_api_key_here') {
        return {
            results: [],
            error: 'Tavily API key not configured'
        };
    }

    try {
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: apiKey,
                query: query,
                search_depth: 'basic',
                include_answer: true,
                max_results: 5,
            }),
        });

        if (!response.ok) {
            throw new Error(`Tavily API error: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            results: data.results || [],
        };
    } catch (error: any) {
        console.error('Search error:', error);
        return {
            results: [],
            error: error.message || 'Search failed'
        };
    }
}

// Format search results for AI context
export function formatSearchResults(results: Array<{
    title: string;
    url: string;
    content: string;
    score: number;
}>): string {
    if (results.length === 0) {
        return 'No search results found.';
    }

    return results
        .map((result, index) => {
            return `[${index + 1}] ${result.title}
URL: ${result.url}
Content: ${result.content.substring(0, 300)}...
`;
        })
        .join('\n\n');
}
