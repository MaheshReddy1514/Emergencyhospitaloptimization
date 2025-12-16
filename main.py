from dataclasses import dataclass
from typing import List
import math
import random
from datetime import datetime

# ------------------ DATA MODELS ------------------

@dataclass
class Location:
    lat: float
    lng: float

@dataclass
class Patient:
    location: Location
    severity: str
    condition: str
    requires_icu: bool

@dataclass
class Hospital:
    id: str
    location: Location
    total_beds: int
    available_beds: int
    icu_beds: int
    available_icu_beds: int
    specializations: List[str]
    doctors_on_duty: int
    avg_wait_time: int

@dataclass
class Ambulance:
    id: str
    location: Location
    speed: float
    available: bool

# ------------------ UTILITIES ------------------

def calculate_distance(lat1, lng1, lat2, lng2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(dlng / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def get_traffic_condition(distance):
    hour = datetime.now().hour
    rush = (7 <= hour <= 9) or (16 <= hour <= 19)
    severity = min(random.random() * 0.3 + (0.3 if rush else 0), 1)
    factor = 1 + severity * 0.8
    return factor

def calculate_travel_time(distance, speed, factor):
    return (distance / speed) * 60 * factor

# ------------------ SCORING ------------------

def specialization_score(hospital, patient):
    mapping = {
        "Trauma": ["Trauma"],
        "Cardiac": ["Cardiology"],
        "General": ["General"]
    }
    required = mapping.get(patient.condition, ["General"])
    return 1.0 if any(s in hospital.specializations for s in required) else 0.5

def capacity_score(hospital, patient):
    if patient.requires_icu:
        return hospital.available_icu_beds / hospital.icu_beds if hospital.available_icu_beds else 0
    return hospital.available_beds / hospital.total_beds if hospital.available_beds else 0

def hospital_score(hospital, patient, distance):
    weights = {
        "Critical": (0.5, 0.3, 0.2),
        "High": (0.4, 0.3, 0.3),
        "Moderate": (0.3, 0.3, 0.4),
        "Low": (0.2, 0.3, 0.5)
    }

    w_dist, w_cap, w_spec = weights[patient.severity]

    dist_score = max(0, 1 - distance / 20)
    cap_score = capacity_score(hospital, patient)
    spec_score = specialization_score(hospital, patient)

    return dist_score * w_dist + cap_score * w_cap + spec_score * w_spec

# ------------------ GREEDY ALGORITHM ------------------

def greedy_algorithm(patient, hospitals):
    best_score = -1
    best_hospital = None

    for h in hospitals:
        if patient.requires_icu and h.available_icu_beds == 0:
            continue

        d = calculate_distance(
            patient.location.lat, patient.location.lng,
            h.location.lat, h.location.lng
        )

        score = hospital_score(h, patient, d)

        if score > best_score:
            best_score = score
            best_hospital = h

    return best_hospital, best_score

# ------------------ MAIN ------------------

if __name__ == "__main__":
    patient = Patient(
        location=Location(17.3850, 78.4867),  # Hyderabad
        severity="Critical",
        condition="Cardiac",
        requires_icu=True
    )

    hospitals = [
        Hospital(
            id="H1",
            location=Location(17.40, 78.48),
            total_beds=200,
            available_beds=50,
            icu_beds=30,
            available_icu_beds=5,
            specializations=["Cardiology", "General"],
            doctors_on_duty=20,
            avg_wait_time=10
        ),
        Hospital(
            id="H2",
            location=Location(17.45, 78.50),
            total_beds=150,
            available_beds=20,
            icu_beds=20,
            available_icu_beds=2,
            specializations=["General"],
            doctors_on_duty=15,
            avg_wait_time=20
        )
    ]

    hospital, score = greedy_algorithm(patient, hospitals)

    print("\n✅ BEST HOSPITAL SELECTED")
    print("-------------------------")
    print(f"Hospital ID : {hospital.id}")
    print(f"Score       : {round(score, 3)}")
