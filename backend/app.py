from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import warnings
import os
import uuid
from datetime import datetime, timezone
from dotenv import load_dotenv
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

warnings.filterwarnings("ignore", category=UserWarning)

load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔹 MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI")
users_col = None
preds_col = None
if MONGO_URI:
    try:
        client = MongoClient(MONGO_URI)
        db = client['neurahealth']
        users_col = db['users']
        preds_col = db['predictions']
        print("Connected to MongoDB Atlas securely!")
    except Exception as e:
        print(f"MongoDB Connection Failure: {e}")
else:
    print("WARNING: MONGO_URI not found in .env")

# 🔹 Load models
diabetes_model = joblib.load("models/diabetes_model.pkl")
heart_model = joblib.load("models/model.pkl") 
cancer_model = joblib.load("models/cancer.pkl")
stroke_model = joblib.load("models/heart_disease_model.pkl")

try:
    heart_scaler = joblib.load("models/scaler.pkl")
except:
    heart_scaler = None

try:
    diabetes_scaler = joblib.load("models/scaler_diabetes.pkl")
except:
    diabetes_scaler = None


def safe_float(val):
    if val is None or val == "":
        return 0.0
    try:
        return float(val)
    except ValueError:
        return 0.0

def safe_int(val):
    if val is None or val == "":
        return 0
    try:
        return int(val)
    except ValueError:
        return 0

def generate_care_plan(disease, data, risk_percentage, stroke_risk=None):
    """Smart Heuristics Engine: Generates highly specialized, staged medical summaries."""
    plan = {
        "analysis": "",
        "diet": "",
        "exercise": "",
        "lifestyle": "",
        "medical": ""
    }
    
    if disease == "diabetes":
        prob = risk_percentage / 100.0
        if prob <= 0.3:
            level = "Low Risk"
        elif prob <= 0.6:
            level = "Pre-diabetes risk"
        elif prob <= 0.8:
            level = "Type 2 Diabetes likely"
        else:
            level = "High/Severe diabetes risk"
            
        glucose = safe_float(data.get('glucose'))
        bmi = safe_float(data.get('bmi'))
        
        plan["analysis"] = f"My analysis calculates a {risk_percentage}% probability, stratifying you into the '{level}' stage."
        if glucose > 125: plan["analysis"] += f" Your elevated fasting glucose of {glucose} mg/dL highly correlates to pancreatic stress."
        
        # Diet
        if "Pre-diabetes" in level or "High" in level or "Type 2" in level:
             plan["diet"] = "Adopt a strict low-glycemic index protocol. Eliminate refined sugars, substitute heavily with cruciferous vegetables, and limit carbohydrate intake to slow-digesting complex grains to minimize heavy insulin spikes."
        else:
             plan["diet"] = "Maintain a metabolic-friendly balanced diet. Ensure you do not over-consume simple sugars to prevent future insulin resistance."
            
        # Exercise
        if "High" in level or "Type 2" in level:
             plan["exercise"] = "Immediate action: A critical 15-20 minute brisk walk immediately following every major meal is strongly indicated. It forces your muscles to absorb glucose safely, bypassing insulin reliance."
        else:
             plan["exercise"] = "Aim for 150 minutes of moderate aerobic cardiovascular routines combined strongly with resistance/hypertrophy training. Increased muscle mass drastically boosts natural insulin sensitivity."
            
        # Lifestyle
        plan["lifestyle"] = "Achieve 7.5 to 8 solid hours of sleep per night; sleep derivation causes massive spikes in cortisol and drastically worsens insulin resistance within days."
        
        # Medical
        if "High" in level or "Type 2" in level:
             plan["medical"] = "Critical priority: Schedule an HbA1c and comprehensive metabolic panel with your primary care provider this week to discuss medical intervention algorithms (e.g., Metformin)."
        else:
             plan["medical"] = "Preventative priority: Monitor fasting glucose annually and track standard metabolic lipids during standard checkups."

    elif disease == "heart":
        level = "High" if risk_percentage > 70 else "Moderate" if risk_percentage > 30 else "Low"
        
        bp = safe_float(data.get('resting_blood_pressure'))
        chol = safe_float(data.get('cholestoral'))
        
        plan["analysis"] = f"My general cardiovascular topology indicates a {risk_percentage}% ({level}) probability of symptomatic heart disease."
        if stroke_risk is not None:
             stroke_lvl = "Critical" if stroke_risk > 70 else "Elevated" if stroke_risk > 35 else "Low"
             plan["analysis"] += f" Furthermore, specifically analyzing near-future cerebral vascular parameters, I detect a {stroke_risk}% ({stroke_lvl}) trajectory for Stroke."
        
        if bp > 130: plan["analysis"] += f" Hypertensive blood pressure ({bp} mmHg) is mechanically tearing vascular walls."
        
        # Diet
        if stroke_risk is not None and stroke_risk > 35:
             plan["diet"] = "Immediate sodium elimination. Follow a heavily restricted DASH diet explicitly engineered to reduce blood pressure. Excessive sodium forces lethal arterial stiffness escalating stroke risks."
        else:
             plan["diet"] = "Adopt a strict Mediterranean-style protocol. Concentrate on Omega-3 fatty acids, olive oil, and high-soluble fiber foods (like oats) to actively pull LDL cholesterol out of the bloodstream."
            
        # Exercise
        if level == "High" or (stroke_risk is not None and stroke_risk > 50):
             plan["exercise"] = "Avoid high-intensity sudden exertion! Do NOT stress the cardiac engine. Stick natively to gentle, steady-state Zone 1 cardiovascular walks until medically cleared."
        else:
             plan["exercise"] = "Perform moderate-to-vigorous aerobic Zone 2/3 exercises 4 times weekly. Endothelial shear stress mechanically improves blood vessel elasticity over time."
            
        # Lifestyle
        if stroke_risk is not None and stroke_risk > 35:
             plan["lifestyle"] = "Blood pressure volatility is the #1 initiator of strokes. Implement heavy stress reduction techniques strictly. If you smoke, complete smoking cessation is physically vital immediately."
        else:
             plan["lifestyle"] = "Practice psychological stress management. Persistent cortisol narrows arteries sequentially over time."
        
        # Medical
        if level == "High" or (stroke_risk is not None and stroke_risk > 50):
             plan["medical"] = "CRITICAL: Contact a cardiologist immediately. You require a clinical ECG interpretation, localized lipid panel, and potentially an ultrasound of your carotid arteries to assess cerebrovascular plaque explicitly."
        else:
             plan["medical"] = "Bring this AI cardiovascular risk profiling to your primary physician to explicitly establish a long-term heart-health timeline."

    elif disease == "cancer":
        level = "High" if risk_percentage > 70 else "Moderate" if risk_percentage > 30 else "Low"
        smoking = safe_int(data.get('SMOKING'))
        yellow = safe_int(data.get('YELLOW_FINGERS'))
        cough = safe_int(data.get('COUGHING'))
        
        plan["analysis"] = f"My pulmonary oncology deep-scan computed a {risk_percentage}% ({level}) correlation specifically mirroring Lung Cancer manifestations."
        if smoking == 1:
             plan["analysis"] += " The ongoing pulmonary particulate exposure from smoking is the apex statistical multiplier in this result."
        
        # Diet
        plan["diet"] = "Focus intensely on an anti-inflammatory, antioxidant-dense diet. Cruciferous vegetables (broccoli, cabbage) contain sulforaphane which explicitly aids the liver and lungs in environmental toxin clearance frameworks."
        
        # Exercise
        plan["exercise"] = "Incorporate controlled diaphragmatic deep-breathing exercises daily. Sustaining maximal lung volume efficiency ensures deep alveolar capillary networks remain highly functional and well-oxygenated."
        
        # Lifestyle
        if smoking == 1 or yellow == 1:
             plan["lifestyle"] = "Immediate and total tobacco/vaping cessation is fundamentally the most critical adjustment for survival. Pulmonary carcinogen bombardment overrides any positive lifestyle adjustments."
        else:
             plan["lifestyle"] = "Minimize all second-hand smoke exposure, rigorously avoid severe environmental/industrial toxins, and monitor home environments for radon gas leakage."
            
        # Medical
        if level == "High" or cough == 1:
             plan["medical"] = "HIGH PRIORITY: Request an explicit Low-Dose CT (LDCT) scan of your lungs from a pulmonologist or oncologist immediately. Do not wait for symptomatic deterioration. Rule out COPD or neoplastic nodules immediately."
        else:
             plan["medical"] = "Routine priority: Ensure continuous age-appropriate lung surveillance and standard general preventative oncology scans."

    return plan


@app.route('/')
def home():
    return "Backend Running"

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
    if users_col is None:
        return jsonify({"error": "Database not configured"}), 500
    
    existing = users_col.find_one({"username": username})
    if existing:
        return jsonify({"error": "Username already exists"}), 400
    
    user_id = str(uuid.uuid4())
    hashed = generate_password_hash(password)
    users_col.insert_one({
        "user_id": user_id,
        "username": username,
        "password": hashed,
        "created_at": datetime.now(timezone.utc)
    })
    return jsonify({"message": "Registration successful", "user_id": user_id})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if users_col is None:
        return jsonify({"error": "Database not configured"}), 500
        
    user = users_col.find_one({"username": username})
    if user and check_password_hash(user['password'], password):
        return jsonify({"message": "Login successful", "user_id": user['user_id']})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/onboarding', methods=['POST'])
def save_onboarding():
    data = request.json
    user_id = data.get('user_id')
    if not user_id or users_col is None:
        return jsonify({"error": "Invalid request"}), 400
        
    users_col.update_one(
        {"user_id": user_id},
        {"$set": {"onboarding_data": data.get('onboarding', {})}}
    )
    return jsonify({"message": "Onboarding saved successfully!"})

@app.route('/api/history/<user_id>', methods=['GET'])
def get_history(user_id):
    if users_col is None or preds_col is None:
        return jsonify({"error": "Database not configured"}), 500
        
    user = users_col.find_one({"user_id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    predictions = list(preds_col.find({"user_id": user_id}).sort("timestamp", -1))
    for p in predictions:
        p['_id'] = str(p['_id'])  # Convert ObjectId to string for JSON serialization
        
    return jsonify({
        "username": user.get("username"),
        "onboarding_data": user.get("onboarding_data", {}),
        "history": predictions
    })

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    disease = data.get("type", data.get("disease"))

    try:
        stroke_risk_percentage = None

        if disease == "diabetes":
            input_data = [
                safe_float(data.get('pregnancies')),
                safe_float(data.get('glucose')),
                safe_float(data.get('bp')),
                safe_float(data.get('skinThickness')),
                safe_float(data.get('insulin')),
                safe_float(data.get('bmi')),
                safe_float(data.get('diabetes_pedigree', 0.5)),
                safe_float(data.get('age', 30))
            ]
            
            input_array = np.array(input_data).reshape(1, -1)
            if diabetes_scaler:
                input_array = diabetes_scaler.transform(input_array)
            model = diabetes_model

        elif disease == "heart":
            # 1. First Model (General Heart Disease - 23 Features)
            features_23 = np.zeros(23)
            features_23[0] = safe_float(data.get('age'))
            features_23[1] = safe_float(data.get('resting_blood_pressure'))
            features_23[2] = safe_float(data.get('cholestoral'))
            features_23[3] = safe_float(data.get('Max_heart_rate'))
            features_23[4] = safe_float(data.get('oldpeak'))
            
            sex = data.get('sex', '')
            if sex == 'Male':
                features_23[5] = 1 
                features_23[6] = 1 

            cp = data.get('chest_pain_type', '')
            if cp == 'Atypical angina': features_23[7] = 1
            elif cp == 'Non-anginal pain': features_23[8] = 1
            elif cp == 'Typical angina': features_23[9] = 1
            
            if data.get('fasting_blood_sugar', '') == 'Lower than 120 mg/ml':
                features_23[10] = 1
                
            rest_ecg = data.get('rest_ecg', '')
            if rest_ecg == 'Normal': features_23[11] = 1
            elif rest_ecg == 'ST-T wave abnormality': features_23[12] = 1
            
            if data.get('exercise_induced_angina', '') == 'Yes':
                features_23[13] = 1
                
            slope = data.get('slope', '')
            if slope == 'Flat': features_23[14] = 1
            elif slope == 'Upsloping': features_23[15] = 1
            
            vessels = data.get('vessels_colored_by_flourosopy', '')
            if vessels == 'One': features_23[16] = 1
            elif vessels == 'Three': features_23[17] = 1
            elif vessels == 'Two': features_23[18] = 1
            elif vessels == 'Zero': features_23[19] = 1
            
            thal = data.get('thalassemia', '')
            if thal == 'No': features_23[20] = 1
            elif thal == 'Normal': features_23[21] = 1
            elif thal == 'Reversable Defect': features_23[22] = 1
            
            input_array = features_23.reshape(1, -1)
            if heart_scaler:
                input_array = heart_scaler.transform(input_array)
                
            model = heart_model

            # 2. Second Model (Stroke Risk - 15 Features)
            stroke_features = [
                1.0 if sex == 'Male' else 0.0,                   # male
                safe_float(data.get('age')),                     # age
                safe_float(data.get('education', 1.0)),          # education
                safe_float(data.get('currentSmoker', 0.0)),      # currentSmoker
                safe_float(data.get('cigsPerDay', 0.0)),         # cigsPerDay
                safe_float(data.get('BPMeds', 0.0)),             # BPMeds
                safe_float(data.get('prevalentStroke', 0.0)),    # prevalentStroke
                safe_float(data.get('prevalentHyp', 0.0)),       # prevalentHyp
                safe_float(data.get('diabetes', 0.0)),           # diabetes
                safe_float(data.get('cholestoral')),             # totChol
                safe_float(data.get('sysBP', data.get('resting_blood_pressure'))), # sysBP
                safe_float(data.get('diaBP', 80.0)),             # diaBP
                safe_float(data.get('BMI', 25.0)),               # BMI
                safe_float(data.get('heartRate', data.get('Max_heart_rate'))),     # heartRate
                safe_float(data.get('glucose', 100.0)),          # glucose
            ]
            stroke_array = np.array(stroke_features).reshape(1, -1)
            try:
                s_prob_arr = stroke_model.predict_proba(stroke_array)
                if s_prob_arr.shape[1] > 1:
                    s_prob = s_prob_arr[0][1]
                else:
                    s_prob = s_prob_arr[0][0]
                stroke_risk_percentage = round(s_prob * 100, 2)
            except Exception as e:
                # If the secondary model fails, just safely ignore it
                stroke_risk_percentage = None

        elif disease == "cancer":
            c_data = [
                int(data.get('YELLOW_FINGERS', 0)),
                int(data.get('ANXIETY', 0)),
                int(data.get('PEER_PRESSURE', 0)),
                int(data.get('CHRONIC_DISEASE', 0)),
                int(data.get('FATIGUE', 0)),
                int(data.get('ALLERGY', 0)),
                int(data.get('WHEEZING', 0)),
                int(data.get('ALCOHOL_CONSUMING', 0)),
                int(data.get('COUGHING', 0)),
                int(data.get('SWALLOWING_DIFFICULTY', 0)),
                int(data.get('CHEST_PAIN', 0))
            ]
            
            anxyelfin = c_data[0] * c_data[1]  
            c_data.append(anxyelfin)
            
            input_array = np.array(c_data).reshape(1, -1)
            model = cancer_model

        else:
            return jsonify({"error": "Invalid disease type"}), 400

        # Primary Prediction
        try:
            prob_arr = model.predict_proba(input_array)
            if prob_arr.shape[1] > 1:
                prob = prob_arr[0][1]
            else:
                prob = prob_arr[0][0]
        except AttributeError:
             prediction = model.predict(input_array)[0]
             if disease == 'cancer' and prediction == 2:
                  prob = 0.1
             elif disease == 'cancer' and prediction == 1:
                  prob = 0.95
             else:
                  prob = 0.85 if prediction == 1 else 0.15
             
        risk = round(prob * 100, 2)
        
        # Fire our AI reasoning engine
        personalized_care_plan = generate_care_plan(disease, data, risk, stroke_risk_percentage)

        out_json = {
            "risk_percentage": risk,
            "risk_level": "High" if risk > 70 else "Medium" if risk > 30 else "Low",
            "care_plan": personalized_care_plan
        }
        
        if stroke_risk_percentage is not None:
             out_json["stroke_risk"] = stroke_risk_percentage
             
        # Save to MongoDB explicitly
        user_id = data.get("user_id")
        if user_id and preds_col is not None:
             preds_col.insert_one({
                 "user_id": user_id,
                 "disease": disease,
                 "inputs": data,
                 "risk_percentage": risk,
                 "stroke_risk": stroke_risk_percentage,
                 "care_plan": personalized_care_plan,
                 "timestamp": datetime.now(timezone.utc).isoformat()
             })

        return jsonify(out_json)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)