import os
import google.generativeai as genai

genai.configure(api_key='AQ.Ab8RN6JpMmalQK2b5WjeJ4nhHNqTNzTBFzQIMRtvuTyMZwz4LQ')
model = genai.GenerativeModel('gemini-1.5-flash')
try:
    response = model.generate_content("hello")
    print("Success")
except Exception as e:
    print(f"Error: {e}")
