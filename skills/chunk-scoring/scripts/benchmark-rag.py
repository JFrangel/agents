import time
import json

def benchmark_rag(retrieval_func, query: str, expected_docs: list[str]) -> dict:
    start = time.time()
    results = retrieval_func(query)
    latency_ms = (time.time() - start) * 1000

    retrieved_ids = [doc['id'] for doc in results]
    true_positives = len(set(retrieved_ids).intersection(set(expected_docs)))
    
    recall = true_positives / len(expected_docs) if expected_docs else 1.0
    precision = true_positives / len(results) if results else 0.0
    
    # Reciprocal Rank (MRR proxy for first correct result)
    first_rank = 0
    for i, doc_id in enumerate(retrieved_ids):
        if doc_id in expected_docs:
            first_rank = 1 / (i + 1)
            break
            
    return {
        "query": query,
        "latency_ms": float(f"{latency_ms:.2f}"),
        "recall": float(f"{recall:.2f}"),
        "precision": float(f"{precision:.2f}"),
        "reciprocal_rank": float(f"{first_rank:.2f}")
    }

if __name__ == "__main__":
    print("Test RAG benchmark (Dummy Data)...")
    def mock_retrieval(query):
        return [{"id": "doc1"}, {"id": "doc3"}, {"id": "doc5"}]
        
    metrics = benchmark_rag(mock_retrieval, "how to optimize chunks?", ["doc1", "doc2"])
    print(json.dumps(metrics, indent=2))
