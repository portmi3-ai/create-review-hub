export async function askConcierge(question: string): Promise<string> {
  const response = await fetch('/api/concierge', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ question })
  });

  if (!response.ok) {
    throw new Error(`Concierge failed with ${response.status}`);
  }

  const data = await response.json();
  return data.answer ?? 'No answer returned.';
}
