# Memory: chunk-scoring (RAG Optimizer)

Source: skills/chunk-scoring/SKILL.md

## 🟡 Working Memory (sesión actual)
<!-- El agente rellena esto dinámicamente -->
- Última tarea: -
- Estado: IDLE
- Corpus activo: -
- Embedding model en uso: -
- DB vectorial en uso: -

## 📼 Episodic Memory (decisiones de proyecto)
<!-- Añadir aquí decisiones tomadas en sesiones anteriores -->
- Chunk size default: 400 tokens con 15% overlap para texto general
- Para código: split por función/clase, no por tokens
- Hybrid search (Dense+Sparse) consistentemente supera solo-dense en recall

## 📚 Semantic Memory (conocimiento del dominio)
- Reciprocal Rank Fusion (k=60) es el estándar óptimo para combinar rankings
- RAGAS metrics clave: Faithfulness (no alucinar), Answer Relevance, Context Precision
- Cross-encoder reranking mejora el top-5 pero añade 200-500ms de latencia
- BM25 es insustituible para nombres propios, SKUs, términos exactos
- text-embedding-3-small: mejor balance costo/calidad para producción en inglés
- bge-m3: mejor opción open-source multilingüe (inglés + español + otros)

## ⚙️ Procedural Memory (workflows probados)
- RAG básico: ProfileDocuments → ChunkStrategy → EmbedAndStore → HybridSearch → Rerank
- Eval pipeline: GenerateQA → RunRAGA → Fix bottleneck (retrieval vs generation)
- Ver: examples/hybrid-search.md para implementación pgvector + pg_bm25
- Ver: examples/ragas-eval.py para evaluación automática del pipeline