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

# 🔹 Optional scaler (if used during training)
try:
    heart_scaler = joblib.load("models/scaler.pkl")
except:
    heart_scaler = None

try:
    diabetes_scaler = joblib.load("models/scaler_diabetes.pkl")
except:
    diabetes_scaler = None

@app.route('/')
def home():
    return "Backend Running"

@app.route('/predict', methods=['POST'])
def predict():
    print("In predict")
    data = request.json
    disease = data.get("type", data.get("disease"))

    try:
        if disease == "diabetes":
            print("in diabetes")
            # Models: pregnancies, glucose, bp, skinThickness, insulin, bmi, diabetes_pedigree, age
            input_data = [
                float(data.get('pregnancies', 0)),
                float(data.get('glucose', 0)),
                float(data.get('bp', 0)),
                float(data.get('skinThickness', 0)),
                float(data.get('insulin', 0)),
                float(data.get('bmi', 0)),
                float(data.get('diabetes_pedigree', 0.5)),
                float(data.get('age', 30))
            ]
            
            input_array = np.array(input_data).reshape(1, -1)
            if diabetes_scaler:
                input_array = diabetes_scaler.transform(input_array)
                
            model = diabetes_model

            reasons = ["Analysis from clinical parameters"]
            if float(data.get('glucose', 0)) > 125:
                 print("in glucose")
                 reasons.append("High fasting glucose detected")
            if float(data.get('bmi', 0)) >= 30:
                 print("hello")
                 reasons.append("BMI indicates obesity")

        elif disease == "heart":
            # The heart scaler expects 23 columns
            features_23 = np.zeros(23)
            
            features_23[0] = float(data.get('age', 0))
            features_23[1] = float(data.get('resting_blood_pressure', 0))
            features_23[2] = float(data.get('cholestoral', 0))
            features_23[3] = float(data.get('Max_heart_rate', 0))
            features_23[4] = float(data.get('oldpeak', 0))
            
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
            
            reasons = ["Analysis from clinical parameters"]
            if float(data.get('resting_blood_pressure', 0)) > 130:
                reasons.append("Elevated Blood Pressure")
            if float(data.get('cholestoral', 0)) > 200:
                reasons.append("High Cholesterol levels")

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
            
            # Fallback for derived ANXYELFIN
            anxyelfin = c_data[0] * c_data[1]  
            c_data.append(anxyelfin)
            
            input_array = np.array(c_data).reshape(1, -1)
            model = cancer_model
            
            reasons = ["Analysis based on symptomatology"]
            if c_data[2] == 1:
                reasons.append("Peer pressure reported")
            if c_data[0] == 1:
                reasons.append("Yellow fingers reported")

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
             # For some models predicting 2 vs 1 where 2 is benign
             if disease == 'cancer' and prediction == 2:
                  prob = 0.1
             elif disease == 'cancer' and prediction == 1:
                  prob = 0.95
             else:
                  prob = 0.85 if prediction == 1 else 0.15
             
        risk = round(prob * 100, 2)

        return jsonify({
            "risk_percentage": risk,
            "risk_level": "High" if risk > 70 else "Medium" if risk > 30 else "Low",
            "reasons": reasons,
            "recommendations": [
                "Maintain a healthy lifestyle.",
                "Consult with a licensed healthcare professional for a medical diagnosis."
            ]
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)