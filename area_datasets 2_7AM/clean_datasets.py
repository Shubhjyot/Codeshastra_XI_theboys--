import pandas as pd

# File paths
input_file = '/Users/shubhjyot/Desktop/area_datasets/merged_orders.csv'
output_file = '/Users/shubhjyot/Desktop/area_datasets/merged_orders_cleaned.csv'

# Load the merged dataset
df = pd.read_csv(input_file)
print(f"Loaded dataset with {df.shape[0]} rows and {df.shape[1]} columns")

# Display initial information about the dataframe
print("\nDataFrame Info:")
print(df.info())

print("\nSummary Statistics:")
print(df.describe(include='all'))

# Check for missing values in each column
print("\nMissing Values by Column:")
print(df.isnull().sum())

# Check for duplicate rows and remove them if found
duplicates_count = df.duplicated().sum()
print(f"\nNumber of duplicate rows: {duplicates_count}")
if duplicates_count > 0:
    df = df.drop_duplicates()
    print("Duplicate rows removed.")

# Convert date columns to datetime
date_columns = ['Date', 'First_Print_Date_BSR', 'Last_Settlement_Date_BSR']
for col in date_columns:
    # Convert with error coercion (invalid parsing will be set as NaT)
    df[col] = pd.to_datetime(df[col], errors='coerce', dayfirst=True)
    missing_dates = df[col].isnull().sum()
    print(f"Column '{col}' converted to datetime. Missing or invalid dates: {missing_dates}")

# Check the date range in the 'Date' column
if 'Date' in df.columns:
    min_date = df['Date'].min()
    max_date = df['Date'].max()
    print(f"\nDate range in 'Date' column: {min_date} to {max_date}")
    if min_date > max_date:
        print("Warning: Date range issue detected. Please verify date formats.")

# Save the cleaned dataset for further processing
df.to_csv(output_file, index=False)
print(f"\nCleaned dataset saved to {output_file}")
