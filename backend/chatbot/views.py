import os
from google import genai
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from .rag_engine import retrieve_relevant_context

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# 2. System prompt taaki AI SettleEase Buddy jaisa act kare
SYSTEM_INSTRUCTION = """
You are SettleEase AI, a super friendly, helpful Indian relocation buddy.
Your job is to assist people moving to new cities in India with:
1. Finding PGs/Rooms/Flats
2. Tiffin services and local food
3. Emergency contacts & hospitals
4. Local language phrases (Hindi, Kannada, Tamil, Marathi, etc.)
5. Daily home services (Maids, Plumbers, Electricians)

Tone & Style:
- Warm, polite, and helpful in conversational Hinglish/English.
- Keep responses short, clear, and direct (max 2-3 sentences).
- Use relevant emojis (🏠, 🍱, 🚨, 🗣️, ✨).
"""

def generate_ai_reply(message_text):
    try:
        # 1. ChromaDB Vector Search se relevant listings/services dhoondho
        context = retrieve_relevant_context(message_text, n_results=3)

        # 2. Agar matching listings mili, toh prompt me inject karo (RAG)
        if context:
            full_prompt = f"""{SYSTEM_INSTRUCTION}

[REAL-TIME SETTLEEASE DATABASE LISTINGS]:
Humare platform par ye real listings mili hain:
{context}

Instruction: Upar di gayi real listings (Naam, Price, Area, Contact number) ka use karke user ko natural aur helpful recommendation do. Agar koi specific service match hoti hai toh uska naam aur price zaroor mention karo.

User Question: {message_text}
Answer:"""
        else:
            full_prompt = f"{SYSTEM_INSTRUCTION}\n\nUser Question: {message_text}\nAnswer:"

        # 3. Gemini 3.6 Flash ko prompt bhejo
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=full_prompt,
        )
        return response.text.strip()
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "Namaste! Main abhi thoda busy hoon, par aap Services ya Emergency tab se details dekh sakte hain! 😊"




# 3. View jo user ka message lekar AI reply bhejega
class ChatListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.AllowAny]  # Guest users bhi chat kar payenge

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return ChatMessage.objects.filter(user=self.request.user)
        return ChatMessage.objects.none()

    def create(self, request, *args, **kwargs):
        message_text = request.data.get('message', '')
        if not message_text:
            return Response({"error": "Message cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Real AI se reply mangwao
        reply_text = generate_ai_reply(message_text)

        # User aur Bot messages ko safe way mein DB mein save karo
        user_data = {"message": message_text, "sender": "user"}
        bot_data = {"message": reply_text, "sender": "bot"}

        try:
            user_msg = ChatMessage.objects.create(
                user=request.user if request.user.is_authenticated else None,
                message=message_text,
                sender='user'
            )
            user_data = ChatMessageSerializer(user_msg).data
        except Exception as e:
            print(f"Warning: Could not save user message to DB: {e}")

        try:
            bot_msg = ChatMessage.objects.create(
                user=request.user if request.user.is_authenticated else None,
                message=reply_text,
                sender='bot'
            )
            bot_data = ChatMessageSerializer(bot_msg).data
        except Exception as e:
            print(f"Warning: Could not save bot message to DB: {e}")

        # Frontend ko response bhejo
        return Response({
            "user_message": user_data,
            "bot_reply": bot_data,
            "reply": reply_text
        }, status=status.HTTP_201_CREATED)
