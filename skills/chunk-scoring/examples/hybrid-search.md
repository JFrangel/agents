# Hybrid Search — Dense + Sparse con Reciprocal Rank Fusion
# Stack: pgvector (dense) + pg_bm25/ParadeDB (sparse) + Supabase

## ¿Por qué Hybrid Search?
- Dense (embeddings): captura semántica, sinónimos, conceptos relacionados
- Sparse (BM25/keyword): exactitud léxica, nombres propios, términos técnicos precisos
- Combinados con RRF: mejor recall Y precisión que cualquiera por separado

## Implementación con pgvector + pg_bm25 (ParadeDB)

```sql
-- 1. Habilitar extensiones en Supabase
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_bm25;  -- ParadeDB

-- 2. Tabla de chunks con ambos campos
CREATE TABLE chunks (
  id          BIGSERIAL PRIMARY KEY,
  content     TEXT NOT NULL,
  embedding   VECTOR(1536),           -- dense (OpenAI text-embedding-3-small)
  metadata    JSONB DEFAULT '{}',
  doc_type    TEXT,                   -- legal | code | markdown | tabular
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índice HNSW para búsqueda semántica rápida
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- 4. Índice BM25 para keyword search
CALL paradedb.create_bm25(
  index_name => 'chunks_bm25',
  table_name => 'chunks',
  text_fields => ARRAY['content']
);
```

## Python: Hybrid Search con RRF (k=60)

```python
import openai
import supabase
from typing import List, Dict

def reciprocal_rank_fusion(results_list: List[List[Dict]], k: int = 60) -> List[Dict]:
    """Combina múltiples rankings con RRF. k=60 es el valor óptimo estándar."""
    scores: Dict[str, float] = {}
    docs: Dict[str, Dict] = {}
    
    for results in results_list:
        for rank, doc in enumerate(results):
            doc_id = str(doc["id"])
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank + 1)
            docs[doc_id] = doc
    
    sorted_ids = sorted(scores, key=lambda x: scores[x], reverse=True)
    return [docs[doc_id] for doc_id in sorted_ids]

def hybrid_search(query: str, top_k: int = 10, rerank_top: int = 5):
    # 1. Dense retrieval
    embedding = openai.embeddings.create(
        input=query, model="text-embedding-3-small"
    ).data[0].embedding
    
    dense_results = supabase_client.rpc("match_chunks_dense", {
        "query_embedding": embedding,
        "match_count": top_k
    }).execute().data
    
    # 2. Sparse retrieval (BM25)
    sparse_results = supabase_client.rpc("match_chunks_sparse", {
        "query_text": query,
        "match_count": top_k
    }).execute().data
    
    # 3. RRF fusion
    fused = reciprocal_rank_fusion([dense_results, sparse_results])
    
    # 4. Cross-encoder reranking (mejora precisión del top-k)
    # from cohere import Client as CohereClient
    # reranked = cohere_client.rerank(query=query, documents=[d["content"] for d in fused[:20]])
    
    return fused[:rerank_top]
```

## Tabla de Estrategias de Chunking por Tipo de Documento

| Tipo | Chunk Size | Overlap | Estrategia recomendada |
|------|-----------|---------|----------------------|
| Texto general | 400-600 tokens | 15% | RecursiveCharacterTextSplitter |
| Documentos legales | 200-400 tokens | 20% | Por párrafo/artículo legal |
| Código fuente | Por función | 10% | AST-aware splitting |
| Markdown/docs | Por h2/h3 | 5% | MarkdownHeaderTextSplitter |
| Datos tabulares | Por fila/grupo | 0% | CSV row chunking + metadata |
| PDFs escaneados | 300 tokens | 25% | Page-level con OCR cleanup |

## Modelos de Embedding por Caso de Uso

| Modelo | Velocidad | Calidad | Costo | Usar cuando |
|--------|-----------|---------|-------|-------------|
| `text-embedding-3-small` | ⚡ Muy rápido | ✅ Bueno | $ | General, producción de bajo costo |
| `text-embedding-3-large` | Medio | ⭐⭐ Excelente | $$$ | Alta precisión requerida |
| `bge-m3` (open source) | Lento | ⭐⭐ Excelente | Gratis | Multilingüe, self-hosted |
| `cohere-embed-v3` | Rápido | ⭐⭐ Excelente | $$ | Enterprise, classification |
| `nomic-embed-text` | ⚡ Rápido | ✅ Bueno | Gratis | Local, privacidad |
