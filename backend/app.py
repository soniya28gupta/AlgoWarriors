from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import warnings

warnings.filterwarnings("ignore", category=UserWarning)

app = Flask(__name__)
CORS(app)

# 🔹 Load models
diabetes_model = joblib.load("models/diabetes_model.pkl")
heart_model = joblib.load("models/model.pkl") 
cancer_model = joblib.load("models/cancer.pkl")

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

def generate_care_plan(disease, data, risk_percentage):
    """Smart Heuristics Engine: Generates personalized categorized medical summaries."""
    level = "High" if risk_percentage > 70 else "Moderate" if risk_percentage > 30 else "Low"
    
    plan = {
        "analysis": "",
        "diet": "",
        "exercise": "",
        "lifestyle": "",
        "medical": ""
    }
    
    if disease == "diabetes":
        glucose = safe_float(data.get('glucose'))
        bmi = safe_float(data.get('bmi'))
        
        plan["analysis"] = f"My analysis calculates a {risk_percentage}% ({level}) probability for diabetes."
        if glucose > 125: plan["analysis"] += f" Your fasting glucose of {glucose} mg/dL is a primary driver."
        
        # Diet
        if bmi >= 30:
            plan["diet"] = "Focus on a caloric deficit. Emphasize low-glycemic foods, lean proteins, and fiber to stabilize insulin spikes while gradually reducing weight."
        else:
            plan["diet"] = "Maintain a balanced diet with complex carbohydrates. Avoid refined sugars and processed foods to keep your glucose levels steady."
            
        # Exercise
        if level == "High":
            plan["exercise"] = "Incorporate low-impact cardio, such as swimming or brisk walking for 30 minutes daily. A 15-minute walk immediately following meals is highly recommended to suppress glycemic spikes."
        else:
            plan["exercise"] = "Aim for at least 150 minutes of moderate aerobic activity weekly combined with resistance training to improve muscle insulin sensitivity."
            
        # Lifestyle
        plan["lifestyle"] = "Monitor your fasting blood sugar weekly. Ensure you get 7-8 hours of sleep, as sleep deprivation worsens insulin resistance."
        
        # Medical
        if level == "High":
            plan["medical"] = "Immediate priority: Schedule an HbA1c test with your endocrinologist or primary care physician this week for clinical confirmation."
        else:
            plan["medical"] = "Routine priority: Discuss metabolic panels during your next annual physical to ensure markers aren't trending upward."

    elif disease == "heart":
        bp = safe_float(data.get('resting_blood_pressure'))
        chol = safe_float(data.get('cholestoral'))
        
        plan["analysis"] = f"My cardiovascular analysis indicates a {risk_percentage}% ({level}) probability of symptomatic heart disease."
        if bp > 130: plan["analysis"] += f" Hypertensive blood pressure ({bp} mmHg) is heavily weighing on this score."
        
        # Diet
        if chol > 200:
            plan["diet"] = "Adopt a strict Mediterranean-style diet. Eliminate trans fats, reduce saturated fats, and introduce high-soluble fiber foods (like oats and beans) to actively pull cholesterol from your bloodstream."
        else:
            plan["diet"] = "Follow a heart-healthy DASH diet rich in vegetables, fruits, and whole grains. Keep sodium intake under 2,300mg a day."
            
        # Exercise
        if level == "High":
            plan["exercise"] = "Avoid high-intensity sudden exertion. Stick to gentle, steady-state Zone 1 or Zone 2 cardiovascular exercises (like casual cycling) until cleared by a professional."
        else:
            plan["exercise"] = "Engage in moderate-to-vigorous aerobic exercise 3-4 times a week to strengthen your cardiac muscle and improve vascular endothelium health."
            
        # Lifestyle
        plan["lifestyle"] = "Practice stress management through deep breathing or meditation to mitigate blood pressure spikes. Avoid smoking entirely."
        
        # Medical
        if level == "High":
            plan["medical"] = "Critical priority: Contact a cardiologist immediately for a comprehensive lipid panel, stress test, and clinical ECG interpretation."
        else:
            plan["medical"] = "Preventative priority: Bring this cardiovascular assessment to your next doctor's visit to discuss long-term heart-health maintenance."

    elif disease == "cancer":
        smoking = safe_int(data.get('SMOKING'))
        
        plan["analysis"] = f"The oncology screening model calculated a {risk_percentage}% ({level}) correlation with early asymptomatic markers."
        
        # Diet
        plan["diet"] = "Focus heavily on an anti-inflammatory, antioxidant-rich diet. Consume dark leafy greens, berries, and cruciferous vegetables like broccoli and Brussels sprouts."
        
        # Exercise
        plan["exercise"] = "Maintain regular daily movement to keep your immune system highly functional and assist in natural cellular regulation."
        
        # Lifestyle
        if smoking == 1:
            plan["lifestyle"] = "Immediate smoking cessation is the most critical lifestyle change you can make. The intersection of prolonged pulmonary exposure is the highest statistical coefficient for lung vulnerability."
        else:
            plan["lifestyle"] = "Minimize exposure to environmental toxins and limit alcohol consumption, as these generate prolonged inflammatory responses."
            
        # Medical
        if level == "High":
            plan["medical"] = "High priority: Request a proactive, specialized preventative oncology screening panel from your physician instead of waiting for symptomatic progression."
        else:
            plan["medical"] = "Maintain standard age-appropriate cancer screenings (such as mammograms, colonoscopies, or dermatology sweeps) annually."

    return plan


@app.route('/')
def home():
    return "Backend Running"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    disease = data.get("type", data.get("disease"))

    try:
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

        # Prediction
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
        personalized_care_plan = generate_care_plan(disease, data, risk)

        return jsonify({
            "risk_percentage": risk,
            "risk_level": "High" if risk > 70 else "Medium" if risk > 30 else "Low",
            "care_plan": personalized_care_plan
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)