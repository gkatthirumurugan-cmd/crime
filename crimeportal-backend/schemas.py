from typing import Annotated
from pydantic import BaseModel,constr

class RegisterSchema(BaseModel):
    name: str
    email: str
    password: Annotated[str, constr(min_length=8, max_length=72)]


class LoginSchema(BaseModel):
    email: str
    password: Annotated[str, constr(min_length=8, max_length=72)]


class crimes(BaseModel):
    Report_Number: int
    Date_Reported: str
    Date_of_Occurrence: str
    time_occurrence : str
    city : str
    crime_code : int
    crime_description : str
    victim_age : int
    victim_gender : str
    weapon_used : str
    crime_domain : str
    police_deployed : int
    case_closed : str
    date_case_closed : str