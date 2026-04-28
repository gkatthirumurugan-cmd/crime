from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(200))


class Crime(Base):
    __tablename__ = "crimes"

    id = Column(Integer, primary_key=True, index=True)

    report_number = Column(Integer)
    date_reported = Column(String)
    date_occurrence = Column(String)
    time_occurrence = Column(String)
    city = Column(String)

    crime_code = Column(Integer)
    crime_description = Column(String)

    victim_age = Column(Integer)
    victim_gender = Column(String)

    weapon_used = Column(String)
    crime_domain = Column(String)

    police_deployed = Column(Integer)
    case_closed = Column(String)

    date_case_closed = Column(String)