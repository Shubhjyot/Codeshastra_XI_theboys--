import os
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# ---------------------------
# 1. Define file paths for all processed/feature datasets
# ---------------------------
file_paths = [
    '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Home Delivery.csv',
    '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Parcel.csv',
    '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Swiggy.csv',
    '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Zomato.csv',
    '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Dine in.csv',
    '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Garden Table.csv',
    '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_PARTY.csv',
    '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Personal Dine In Room.csv'
]

# ---------------------------
# 2. Load and merge all datasets
# ---------------------------
dataframes = []
for fp in file_paths:
    try:
        df = pd.read_csv(fp)
        print(f"Loaded {os.path.basename(fp)} with {df.shape[0]} rows and {df.shape[1]} columns.")
        dataframes.append(df)
    except Exception as e:
        print(f"Error loading {fp}: {e}")

if not dataframes:
    raise ValueError("No datasets loaded. Please check your file paths.")

merged_data = pd.concat(dataframes, ignore_index=True)
print(f"\nMerged dataset has {merged_data.shape[0]} rows and {merged_data.shape[1]} columns.")

# ---------------------------
# 3. Prepare features for anomaly detection
# ---------------------------
# List of pre-computed anomaly flag columns (to be excluded from features)
flag_columns = [
    'flag_discount_not_approved',
    'flag_discount_high',
    'flag_order_cancelled_no_reason',
    'flag_service_charge_mismatch',
    'flag_huge_time_diff',
    'flag_price_modification',
    'flag_zero_price_or_subtotal',
    'flag_complimentary_price_charged',
    'flag_tax_mismatch'
]

# Select numeric columns as candidate features
numeric_cols = merged_data.select_dtypes(include=[np.number]).columns.tolist()

# Exclude any columns that are our pre-computed anomaly flags (if present)
feature_cols = [col for col in numeric_cols if col not in flag_columns]

print("\nFeature columns used for ML anomaly detection:")
print(feature_cols)

# Fill missing values (you can adjust the strategy if needed)
features_data = merged_data[feature_cols].fillna(0)

# Standardize the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(features_data)

# ---------------------------
# 4. Apply Isolation Forest for anomaly detection
# ---------------------------
# Here, we set contamination to 5% (adjust as needed)
iso_forest = IsolationForest(n_estimators=100, contamination=0.15, random_state=42)
iso_forest.fit(X_scaled)

# Obtain anomaly scores and predictions (Isolation Forest predicts -1 for anomalies, 1 for normal points)
anomaly_scores = iso_forest.decision_function(X_scaled)
anomaly_labels = iso_forest.predict(X_scaled)

# Append results to the merged dataframe
merged_data['anomaly_score'] = anomaly_scores
merged_data['anomaly_label'] = anomaly_labels

# ---------------------------
# 5. Visualize the anomaly score distribution
# ---------------------------
plt.figure(figsize=(10, 6))
plt.hist(anomaly_scores, bins=50, color='skyblue', edgecolor='black')
plt.title("Distribution of Anomaly Scores")
plt.xlabel("Anomaly Score")
plt.ylabel("Frequency")
plt.tight_layout()
anomaly_histogram = "anomaly_score_distribution_all.png"
plt.savefig(anomaly_histogram)
plt.show()
print(f"Anomaly score distribution chart saved as '{anomaly_histogram}'.")

# ---------------------------
# 6. Print a summary and save the results
# ---------------------------
n_anomalies = (anomaly_labels == -1).sum()
print("\nAnomaly detection results summary:")
print(merged_data[['anomaly_score', 'anomaly_label']].describe())
print(f"Total anomalies detected: {n_anomalies} out of {merged_data.shape[0]} records.")

# Save the merged dataset with anomaly detection results
output_file = '/Users/shubhjyot/Desktop/area_datasets/merged_all_anomaly_detection.csv'
merged_data.to_csv(output_file, index=False)
print(f"Merged anomaly detection results saved to '{output_file}'.")
