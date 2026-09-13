import os
import chromadb
from google import genai
from services.models import Service
from emergency.models import EmergencyContact
from languages.models import Phrase

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# 2. ChromaDB Persistent Client
db_path = os.path.join(os.path.dirname(__file__), '..', 'chroma_db')
chroma_client = chromadb.PersistentClient(path=db_path)

# 3. Collection create karo
collection = chroma_client.get_or_create_collection(name="settleease_v2",embedding_function=None)


def get_embedding(text: str) -> list:
    """Google Gemini API se direct 0.1s mein vector lata hai (Zero file download)"""
    try:
        response = client.models.embed_content(
            model="gemini-embedding-001",
            contents=text
        )
        return response.embeddings[0].values
    except Exception as e:
        print(f"Embedding error: {e}")
        return []


def index_single_service(service_instance):
    """Nayi Service add ya update hote hi turant Vector DB mein index kar deta hai"""
    try:
        doc_text = f"Service Name: {service_instance.name}. Category: {service_instance.get_category_display() if hasattr(service_instance, 'get_category_display') else service_instance.category}. Area: {service_instance.area}, City: {service_instance.city}. Price: Rs. {service_instance.price} ({service_instance.price_type}). Rating: {service_instance.rating} Stars. Contact: {service_instance.contact_number}."
        emb = get_embedding(doc_text)
        if emb:
            collection.upsert(
                ids=[f"service_{service_instance.id}"],
                documents=[doc_text],
                embeddings=[emb],
                metadatas=[{"type": "service", "id": service_instance.id, "city": service_instance.city, "area": service_instance.area}]
            )
            print(f"[AUTO-SYNC] Service '{service_instance.name}' successfully indexed in Vector DB!")
    except Exception as e:
        print(f"[AUTO-SYNC ERROR] {e}")


def sync_database_to_vector_db():
    print("[INFO] SettleEase Data ko Vector DB mein sync kar rahe hain...")
    documents = []
    embeddings = []
    metadatas = []
    ids = []

    # A. Services Data
    services = Service.objects.all()
    for s in services:
        doc_text = f"Service Name: {s.name}. Category: {s.get_category_display() if hasattr(s, 'get_category_display') else s.category}. Area: {s.area}, City: {s.city}. Price: Rs. {s.price} ({s.price_type}). Rating: {s.rating} Stars. Contact: {s.contact_number}."
        emb = get_embedding(doc_text)
        if emb:
            documents.append(doc_text)
            embeddings.append(emb)
            metadatas.append({"type": "service", "id": s.id, "city": s.city, "area": s.area})
            ids.append(f"service_{s.id}")

    # B. Emergency Contacts
    emergencies = EmergencyContact.objects.all()
    for e in emergencies:
        doc_text = f"Emergency: {e.name}. Type: {e.get_type_display() if hasattr(e, 'get_type_display') else e.type}. Pincode: {e.pincode}. Phone: {e.phone}. Address: {e.address}."
        emb = get_embedding(doc_text)
        if emb:
            documents.append(doc_text)
            embeddings.append(emb)
            metadatas.append({"type": "emergency", "id": e.id, "pincode": e.pincode})
            ids.append(f"emergency_{e.id}")

    # C. Language Phrases
    phrases = Phrase.objects.all()
    for p in phrases:
        doc_text = f"Language Phrase ({p.category}): English: '{p.english}', Hindi: '{p.hindi}', Kannada: '{p.kannada}', Tamil: '{p.tamil}', Bengali: '{p.bengali}', Marathi: '{p.marathi}'."
        emb = get_embedding(doc_text)
        if emb:
            documents.append(doc_text)
            embeddings.append(emb)
            metadatas.append({"type": "phrase", "id": p.id, "category": p.category})
            ids.append(f"phrase_{p.id}")

    if ids:
        collection.upsert(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas
        )
        print(f"[SUCCESS] Total {len(ids)} items successfully Vector DB mein index ho gaye!")
    else:
        print("[WARNING] Database mein sync karne ke liye koi data nahi mila.")


def retrieve_relevant_context(user_query: str, n_results: int = 3) -> str:
    try:
        if collection.count() == 0:
            sync_database_to_vector_db()

        query_emb = get_embedding(user_query)
        if not query_emb:
            return ""

        results = collection.query(
            query_embeddings=[query_emb],
            n_results=n_results
        )

        if results and 'documents' in results and results['documents']:
            matching_docs = results['documents'][0]
            context = "\n---\n".join(matching_docs)
            return context
    except Exception as e:
        print(f"Retrieval error: {e}")
    
    return ""
