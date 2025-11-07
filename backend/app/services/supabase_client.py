from supabase import create_client, Client
from app.core.config import settings

def get_supabase() -> Client:
    return create_client(settings.NEXT_PUBLIC_SUPABASE_URL, settings.NEXT_PUBLIC_SUPABASE_ANON_KEY)

