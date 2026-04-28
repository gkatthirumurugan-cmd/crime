from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from pydantic import BaseModel, Field, constr

from pathlib import Path
import pandas as pd
from matplotlib import pyplot as plt

import models, schemas, auth
from database import SessionLocal, engine

import math
         
BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "crimes.csv"

def load_data():
  try:
    df = pd.read_csv(CSV_PATH, sep=",", engine="python", on_bad_lines="skip")
    
    df.rename(columns={
            "Report Number": "Report_Number",
            "Crime Description": "Crime_Description",
            "Crime Domain": "Crime_Domain",
            "Weapon Used": "Weapon_Used",
            "Victim Age": "Victim_Age",
            "Victim Gender": "Victim_Gender",
            "Case Closed": "Case_Closed",
            "Crime Code": "Crime_Code",
            "Date Case Closed": "Date_Case_Closed"
        }, inplace=True)

        # ✅ Fill missing values
    df["Crime_Description"] = df.get("Crime_Description", "").fillna("Unknown")
    df["Crime_Domain"] = df.get("Crime_Domain", "").fillna("Other Crime")
    df["Weapon_Used"] = df.get("Weapon_Used", "").fillna("Other")
    df["Victim_Age"] = df.get("Victim_Age", "").fillna("-")
    df["Victim_Gender"] = df.get("Victim_Gender", "").fillna("-")
    df["Case_Closed"] = (
    df.get("Case_Closed", "No")
    .astype(str)
    .str.strip()
    .str.lower()
)
    df["Case_Closed"] = df["Case_Closed"].replace({
    "yes": "Yes",
    "closed": "Yes",
    "true": "Yes",
    "1": "Yes",

    "no": "No",
    "open": "No",
    "false": "No",
    "0": "No",
    "nan": "No",
    "": "No"
})
    return df

  except Exception as e:
    print("Error loading crimes.csv:", e)
    df = pd.DataFrame()

df = load_data()

# ✅ Map cities to states
city_to_state = {

    "Ahmedabad": "Gujarat",
    "Surat": "Gujarat",
    "Vadodara": "Gujarat",

    "Chennai": "Tamil Nadu",
    "Coimbatore": "Tamil Nadu",
    "Madurai": "Tamil Nadu",

    "Mumbai": "Maharashtra",
    "Pune": "Maharashtra",
    "Nagpur": "Maharashtra",

    "Delhi": "Delhi",

    "Bangalore": "Karnataka",
    "Mysore": "Karnataka",

    "Kolkata": "West Bengal",

    "Hyderabad": "Telangana",

    "Ludhiana": "Punjab",
    "Amritsar": "Punjab",

    "Ghaziabad": "Uttar Pradesh",
    "Lucknow": "Uttar Pradesh",
    "Kanpur": "Uttar Pradesh",

    "Jaipur": "Rajasthan",

    "Visakhapatnam": "Andhra Pradesh"

}
if not df.empty:
    df['State'] = df['City'].map(city_to_state).fillna(df["City"])

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# LOGIN REQUEST MODEL
class LoginRequest(BaseModel):
    email: str
    password: Annotated[str, constr(min_length=8, max_length=72)]

#pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

class Crime(BaseModel):
    Report_Number: int = Field(..., alias="Report Number")
    Date_Reported: str = Field(..., alias="Date Reported")
    Date_of_Occurrence: str = Field(..., alias="Date of Occurrence")
    Time_of_Occurrence: str = Field(..., alias="Time of Occurrence")
    City: str
    Crime_Code: int = Field(..., alias="Crime Code")
    Crime_Description: str = Field(..., alias="Crime Description")
    Victim_Age: int = Field(..., alias="Victim Age")
    Victim_Gender: str = Field(..., alias="Victim Gender")
    Weapon_Used: str = Field(..., alias="Weapon Used")
    Crime_Domain: str = Field(..., alias="Crime Domain")
    Police_Deployed: int = Field(..., alias="Police Deployed")
    Case_Closed: str = Field(..., alias="Case Closed")
    Date_Case_Closed: str | None = Field(None, alias="Date Case Closed")

    class Config:
        populate_by_name = True

def clean_record(record: dict) -> dict:
    for key, value in record.items():
        if isinstance(value, float) and math.isnan(value):
            record[key] = None
    return record

class PredictionRequest(BaseModel):
    city: str
    crimeType: str
    year: int

def save_csv():
    global df
    df.to_csv(CSV_PATH, index=False)

def clean_nan(value):
    if isinstance(value, float) and math.isnan(value):
        return ""
    return value


# =========================
# REGISTER
# =========================

@app.post("/register")
async def register(user: schemas.RegisterSchema, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = auth.hash_password(user.password)

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


# =========================
# LOGIN 
# =========================

@app.post("/login")
async def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not auth.verify_password(data.password, user.password):
        raise HTTPException(status_code=400, detail="Wrong password")

    return {"message": "Login successful"}

# =========================
# CRIMES API
# =========================
@app.get("/crimes")
def get_crimes():
    return df.replace({pd.NA: "", None: ""}).to_dict(orient="records")



@app.post("/crimes")
def add_crime(crime: dict):
    global df

    next_id = 1 if df.empty else int(df["Report_Number"].max()) + 1

    new_row = {
        "Report_Number": next_id,
        "City": crime.get("City", ""),
        "Crime_Description": crime.get("Crime_Description", ""),
        "Crime_Domain": crime.get("Crime_Domain", ""),
        "Weapon_Used": crime.get("Weapon_Used", ""),
        "Victim_Age": crime.get("Victim_Age", ""),
        "Victim_Gender": crime.get("Victim_Gender", ""),
        "Case_Closed": "Yes" if str(
    crime.get("Case_Closed", "No")
).lower() in ["yes", "true", "1", "closed"] else "No",
        "State": crime.get("City", "")
    }

    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    df.to_csv(CSV_PATH, index=False)

    return {
        "message": "Crime Added Successfully",
        "reportNumber": next_id
    }



@app.get("/stats")
def stats():
    total = len(df)
    violent = len(df[df["Crime_Domain"] == "Violent Crime"])
    closed = len(
    df[df["Case_Closed"].astype(str).str.lower().str.strip() == "yes"]
)

    rate = round((closed / total) * 100, 2) if total > 0 else 0

    return {
        "Total Crimes": total,
        "Violent Crimes": violent,
        "Cases Closed": closed,
        "Closure Rate": f"{rate}%"
    }

@app.get("/state-crimes")
def state_crimes():
    if df.empty:
        return []

    counts = df.groupby("State").size().reset_index(name="totalCrimes")
    counts.rename(columns={"State": "state"}, inplace=True)

    return counts.to_dict(orient="records")

@app.get("/state-crimes-chart")
def get_state_crimes_chart():
    if df.empty:
        return {"message": "No data loaded from crimes.csv"}
    crime_counts = df.groupby("State")["Crime_Code"].count()
    if crime_counts.empty:
        return {"message": "No crime counts available"}
    plt.figure(figsize=(8,5))
    crime_counts.plot(kind="bar")
    plt.title("Crimes by State")
    plt.ylabel("Number of Crimes")
    chart_path = BASE_DIR / "state_crimes.png"
    plt.savefig(chart_path)
    return {"chart": str(chart_path)}


@app.delete("/crimes/{report_number}")
def delete_crime(report_number: int):
    global df

    if df.empty:
        raise HTTPException(status_code=404, detail="No data")

    mask = df["Report_Number"].astype(int) == report_number

    if not mask.any():
        raise HTTPException(status_code=404, detail="Crime not found")

    df = df[~mask]
    df.to_csv(CSV_PATH, index=False)

    return {"message": "Deleted successfully"}


@app.post("/predict")
def predict(req: PredictionRequest):

    city = req.city.strip().lower()
    crime = req.crimeType.strip().lower()

    subset = df[
        (df["City"].astype(str).str.lower() == req.city.lower()) &
        (df["Crime_Description"].astype(str).str.lower() == req.crimeType.lower())
    ]

    if subset.empty:
        return {
            "level": "No Data",
            "estimated_rate": 0,
            "cases": 0,
            "population": "0 Lakhs"
        }

    cases = len(subset)

    # Crime level
    if cases <= 20:
        level = "Low Crime Area"
    elif cases <= 50:
        level = "Moderate Crime Area"
    elif cases <= 100:
        level = "High Crime Area"
    else:
        level = "Very High Crime Area"

    # Fake estimated population (Lakhs)
    population = round((cases * 0.5885), 3)

    # Crime rate formula
    estimated_rate = round((cases / population), 6)

    return {
        "level": level,
        "estimated_rate": estimated_rate,
        "cases": cases,
        "population": f"{population} Lakhs"
    }

@app.get("/diagnostics")
def diagnostics():
    return {
        "rows": len(df),
        "columns": list(df.columns),
        "sample": df.head(5).to_dict(orient="records")
    }
