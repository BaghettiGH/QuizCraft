from sqlalchemy import Column, Integer, String
from app.core.database import Base

class User(Base):
    __tablename__="User"
    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, unique=True, index=True)
    last_name = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

            