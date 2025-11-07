from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    NEXT_PUBLIC_SUPABASE_URL: str | None = None
    NEXT_PUBLIC_SUPABASE_ANON_KEY: str | None = None
    OPENAI_API_KEY: str | None = None
    GOOGLE_API_KEY: str | None = None
    ENV: str = "development"
    NEXT_PUBLIC_API_BASE_URL: str | None = None
    class Config:
        env_file = ".env"

settings = Settings()
