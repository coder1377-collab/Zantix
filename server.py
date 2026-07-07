"""
Zantix — Your Dost Chatbot Backend
Flask server that proxies requests to the Google Gemini API.
Keeps the API key server-side for security.
"""

import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# ─── CONFIGURATION ───
def load_env_file(path='.env'):
    """Load simple KEY=VALUE pairs from a local .env file."""
    if not os.path.exists(path):
        return

    with open(path, 'r', encoding='utf-8') as env_file:
        for line in env_file:
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue

            key, value = line.split('=', 1)
            os.environ[key.strip()] = value.strip().strip('"').strip("'")


load_env_file()

# Set your Gemini API key in .env or via environment variable.
API_KEY = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
API_KEY_CONFIGURED = bool(API_KEY and API_KEY != 'PASTE_YOUR_GEMINI_API_KEY_HERE')

genai.configure(api_key=API_KEY)

# ─── SYSTEM PROMPT ───
SYSTEM_PROMPT = """You are "Your Dost" — a warm, empathetic, and supportive AI mental wellness companion on the Zantix platform.

Your role:
- Listen with deep empathy and validate the user's emotions
- Be gentle, warm, and non-judgmental in every response
- Use a conversational, caring tone — like a trusted friend
- Help the user feel heard and understood
- Offer comfort and gentle perspective, never prescriptive advice
- Use emojis sparingly but warmly (💚, 🌿, ✨) to feel approachable
- Keep responses concise but meaningful (2-4 sentences usually)
- If someone shares something heavy, acknowledge it before anything else

Safety rules:
- You are NOT a therapist or medical professional — never diagnose or prescribe
- If someone mentions self-harm, suicide, or severe crisis, immediately and gently direct them to:
  • AASRA: 9820466627
  • Vandrevala Foundation: 1860-2662-345
  • iCall: 9152987821
- Never minimize someone's pain or say "just think positive"
- Never share personal opinions on controversial topics
- Always maintain the user's anonymity and privacy

Remember: You're a safe space. The user came here because they need to feel heard. Make every word count."""

# Create the model
model = genai.GenerativeModel(
    model_name='gemini-2.0-flash',
    system_instruction=SYSTEM_PROMPT
)


# ─── ROUTES ───

@app.route('/')
def serve_index():
    """Serve the main landing page."""
    return send_from_directory('.', 'index.html')


@app.route('/chatbot')
def serve_chatbot():
    """Serve the chatbot page."""
    return send_from_directory('.', 'chatbot.html')


@app.route('/community')
def serve_community():
    """Serve the community page."""
    return send_from_directory('.', 'community.html')


@app.route('/mood-tracker')
def serve_mood_tracker():
    """Serve the mood tracker page."""
    return send_from_directory('.', 'mood-tracker.html')


@app.route('/private-vent')
def serve_private_vent():
    """Serve the private vent page."""
    return send_from_directory('.', 'private-vent.html')


@app.route('/streak')
def serve_streak():
    """Serve the streak page."""
    return send_from_directory('.', 'streak.html')


@app.route('/relax')
def serve_relax():
    """Serve the relax page."""
    return send_from_directory('.', 'relax.html')


@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Handle chat messages.
    Expects JSON: { "message": "user text", "history": [...] }
    Returns JSON: { "reply": "AI response" }
    """
    try:
        if not API_KEY_CONFIGURED:
            return jsonify({
                'error': 'Gemini API key is not configured. Add it to .env as GEMINI_API_KEY.'
            }), 500

        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400

        user_message = data['message'].strip()
        if not user_message:
            return jsonify({'error': 'Empty message'}), 400

        # Build conversation history for context
        history = data.get('history', [])
        chat_history = []
        for msg in history:
            role = 'user' if msg.get('role') == 'user' else 'model'
            chat_history.append({
                'role': role,
                'parts': [msg.get('content', '')]
            })

        # Start chat with history
        chat = model.start_chat(history=chat_history)

        # Send the new message
        response = chat.send_message(user_message)

        return jsonify({
            'reply': response.text,
            'status': 'success'
        })

    except Exception as e:
        print(f"Error in /api/chat: {e}")
        return jsonify({
            'error': 'Something went wrong. Please try again.',
            'details': str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'ok',
        'service': 'Zantix Your Dost Backend'
    })


# Serve static files (CSS, JS, etc.)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)


if __name__ == '__main__':
    print("\n🌿 Zantix — Your Dost Backend Server")
    print("=" * 40)

    if not API_KEY_CONFIGURED:
        print("⚠️  WARNING: No Gemini API key set!")
        print("   Add it to .env as: GEMINI_API_KEY='your-key'")
        print("   Or set it via: export GEMINI_API_KEY='your-key'")
    else:
        print("✅ Gemini API key configured")

    print(f"\n🚀 Server starting on http://localhost:5001")
    print(f"   Landing page:  http://localhost:5001/")
    print(f"   Chatbot:       http://localhost:5001/chatbot")
    print(f"   API endpoint:  http://localhost:5001/api/chat")
    print("=" * 40 + "\n")

    app.run(debug=True, port=5001)
