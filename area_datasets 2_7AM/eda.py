import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load the cleaned dataset with date parsing for the relevant columns
file_path = '/Users/shubhjyot/Desktop/area_datasets/merged_orders_cleaned.csv'
df = pd.read_csv(file_path, parse_dates=['Date', 'First_Print_Date_BSR', 'Last_Settlement_Date_BSR'])

# Display the first few rows and basic summary statistics
print("First 5 rows of the dataset:")
print(df.head())

print("\nSummary Statistics (numerical):")
print(df.describe())

print("\nSummary Statistics (all columns):")
print(df.describe(include='all'))

print("\nMissing Values by Column:")
print(df.isnull().sum())

# ---------------------------
# Visualization: Orders by Data Source
# ---------------------------
data_source_counts = df['data_source'].value_counts()
plt.figure(figsize=(8, 6))
plt.bar(data_source_counts.index, data_source_counts.values, color='skyblue')
plt.title("Orders by Data Source")
plt.xlabel("Data Source")
plt.ylabel("Number of Orders")
plt.show()

# ---------------------------
# Visualization: Time Series of Orders per Day
# ---------------------------
# Group orders by date and count them
orders_by_date = df.groupby(df['Date'].dt.date).size()
plt.figure(figsize=(12, 6))
plt.plot(list(orders_by_date.index), orders_by_date.values, marker='o', linestyle='-', color='blue')
plt.title("Orders per Day")
plt.xlabel("Date")
plt.ylabel("Number of Orders")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# ---------------------------
# Visualization: Histogram of Final_Total
# ---------------------------
plt.figure(figsize=(8, 6))
plt.hist(df['Final_Total'], bins=30, color='green', edgecolor='black')
plt.title("Distribution of Final Total")
plt.xlabel("Final Total")
plt.ylabel("Frequency")
plt.show()

# ---------------------------
# Visualization: Histogram of Discount
# ---------------------------
plt.figure(figsize=(8, 6))
plt.hist(df['Discount'], bins=30, color='orange', edgecolor='black')
plt.title("Distribution of Discount")
plt.xlabel("Discount")
plt.ylabel("Frequency")
plt.show()

# ---------------------------
# Visualization: Correlation Heatmap for Numerical Features
# ---------------------------
# Calculate correlation matrix for numeric columns
corr_matrix = df.select_dtypes(include=[np.number]).corr()

plt.figure(figsize=(12, 10))
im = plt.imshow(corr_matrix, cmap='viridis', interpolation='none')
plt.title("Correlation Matrix of Numerical Features")
plt.colorbar(im, fraction=0.046, pad=0.04)
plt.xticks(range(len(corr_matrix.columns)), corr_matrix.columns, rotation=90)
plt.yticks(range(len(corr_matrix.columns)), corr_matrix.columns)
plt.tight_layout()
plt.show()
