from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SUPABASE_URL: str | None = None
    SUPABASE_KEY: str | None = None
    openai_api_key: str | None = None
    class Config:
        env_file = ".env"

settings = Settings()
