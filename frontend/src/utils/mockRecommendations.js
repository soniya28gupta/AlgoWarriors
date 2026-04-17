export const getFallbackRecommendations = (disease, riskPercentage) => {
    const riskLevel = riskPercentage > 70 ? 'High' : riskPercentage > 30 ? 'Medium' : 'Low';

    const diseaseNames = {
        diabetes: "Diabetes Spectrum",
        heart: "Cardiovascular Profile",
        cancer: "Pulmonary / Oncology Baseline"
    };

    const targetName = diseaseNames[disease] || "General Health";

    const baseData = {
        Low: {
            summary: `Your clinical bio-markers indicate an excellent baseline within the ${targetName} framework. No acute or critical markers were detected.`,
            risk_explanation: [
                "Key metabolic functions are operating within normal systemic boundaries.",
                "Lifestyle markers show healthy regulatory habits.",
                "No elevated chronic strain identified in parameter inputs."
            ],
            do: ["Continue your current balanced diet protocol", "Maintain a baseline of 150 mins zone-2 cardio weekly", "Prioritize 7-8 hours of continuous sleep"],
            dont: ["Don't dramatically alter your successful routine", "Avoid sudden spikes in processed sugars", "Limit late-night heavy meals"],
            warnings: [],
            diet: ["Standard Mediterranean or Balanced Macro diet", "Constant daily hydration (2.5L+)", "Natural whole foods over processed alternatives"],
            exercise: ["30 mins brisk walk daily", "Light resistance training 2x per week"],
            morning: ["Hydrate immediately upon waking", "10-15 mins of light mobility/stretching"],
            afternoon: ["Walk post-lunch to stabilize glucose", "Maintain ergonomic posture during work tasks"],
            evening: ["Begin down-regulation of screen time before bed", "Consume final meal at least 3 hours before sleep"],
            night: ["Ensure dark, cool room environment", "Read or meditate to lower cortisol"]
        },
        Medium: {
            summary: `Elevated biomarkers have been tracked regarding your ${targetName}. Preventative adjustments are highly recommended to stabilize trajectory.`,
            risk_explanation: [
                "Partial indicators reflect moderate physiological stress thresholds.",
                "Age, lifestyle, or hereditary flags have tripped secondary warnings.",
                "Routine clinical monitoring should be established."
            ],
            do: ["Initiate strict recording of daily dietary intake", "Schedule a comprehensive blood panel with your PCP", "Incorporate active recovery rest days"],
            dont: ["Avoid highly processed inflammatory foods", "Do not ignore persistent fatigue or discomfort signals", "Limit alcohol to absolute minimum boundaries"],
            warnings: ["Monitoring advised: Transitioning risk stage if current lifestyle persists."],
            diet: ["Prioritize lean proteins and high-fiber cruciferous vegetables", "Eliminate refined carbohydrates and added sugars", "Control sodium closely (< 2000mg/day)"],
            exercise: ["Zone-2 cardio 45 mins/day to improve cardiovascular efficiency", "Weight training 3x/week focusing on structural compound movements"],
            morning: ["Drink 16oz of water before any caffeine", "Engage in 20 mins of elevated heart rate activity"],
            afternoon: ["Strict portion control during mid-day meals", "Incorporate standing breaks every 60 mins"],
            evening: ["Avoid starchy carbohydrates before bed", "Implement a hard cutoff for artificial light exposure"],
            night: ["Target deep REM sleep architecture via cool temperatures", "Stretch lower body to relieve systemic tension"]
        },
        High: {
            summary: `CRITICAL ALERT: Your algorithmic profile matches advanced severity clusters mapping to ${targetName}. Immediate clinical intervention and strict lifestyle turnaround is mandated.`,
            risk_explanation: [
                "Multiple overlapping critical biometric values flagged.",
                "Severe compounding factors detected across inputs.",
                "High statistical probability of acute future events without immediate mitigation."
            ],
            do: ["Schedule a specialist appointment IMMEDIATELY", "Commit to zero-tolerance limits on listed dietary restrictions", "Begin daily vital sign logging (BP, Glucose, etc.)"],
            dont: ["ABSOLUTELY NO tobacco or inflammatory toxins", "Do not engage in extreme physical exertion without doctor clearance", "Stop ignoring minor physiological warning signs"],
            warnings: [
                "URGENT: Your data profile suggests clinical intervention is overdue.",
                "Do not start heavy exercise without a cardiologist or specialist clearance."
            ],
            diet: ["Strict anti-inflammatory caloric deficit if BMI is elevated", "Zero added sugars, strict low-glycemic indexing required", "Consult a registered clinical dietitian"],
            exercise: ["Light, sustainable walking daily (Doctor permitted ONLY)", "Gentle cardiovascular rehabilitation", "Strictly avoid powerlifting or max-heart-rate sprints"],
            morning: ["Log morning fasting vitals immediately", "Take prescribed medications exactly as scheduled"],
            afternoon: ["Maintain absolute strict diet adherence", "Nap or rest to control cortisol spikes"],
            evening: ["Log evening vitals", "Consume final extremely light, easily digestible meal 4 hours before bed"],
            night: ["Practice clinical guided breathing to lower heart rate", "Secure 8-9 hours of restorative rest"]
        }
    };

    const d = baseData[riskLevel];

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                summary: d.summary,
                risk_explanation: d.risk_explanation,
                lifestyle_changes: {
                    do: d.do,
                    dont: d.dont
                },
                diet_plan: d.diet,
                exercise_plan: d.exercise,
                daily_plan: {
                    morning: d.morning,
                    afternoon: d.afternoon,
                    evening: d.evening,
                    night: d.night
                },
                weekly_plan: [
                    { day: "Monday", plan: ["Baseline vitals check", "Strict macro adherence", "Cardio routine"] },
                    { day: "Tuesday", plan: ["Resistance/Mobility", "Specialist research/booking"] },
                    { day: "Wednesday", plan: ["Cardio routine", "Active stretching", "Meal prep review"] },
                    { day: "Thursday", plan: ["Rest period / Vitals Log analysis", "Light walking"] },
                    { day: "Friday", plan: ["Resistance/Mobility", "Weekend strategy planning"] },
                    { day: "Saturday", plan: ["Extended outdoor low-impact activity", "Stress management down-time"] },
                    { day: "Sunday", plan: ["Full week review", "7-day meal prep", "Full body recovery"] }
                ],
                warnings: d.warnings
            });
        }, 1500); // 1.5 second fake delay to simulate AI processing smoothly
    });
};
