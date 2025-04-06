import pandas as pd
import os

# Define the file path
file_path = r"c:\Users\jayto\Downloads\Codeshastra\Hackathon_Dataset.csv"

# Check if the file exists
if not os.path.exists(file_path):
    print(f"Error: File not found at {file_path}")
    exit(1)

# Read the CSV file
try:
    df = pd.read_csv(file_path)
    print(f"Successfully loaded CSV with {len(df)} rows and {len(df.columns)} columns")
    print(f"Columns: {', '.join(df.columns)}")
except Exception as e:
    print(f"Error reading CSV file: {e}")
    exit(1)

# Check for duplicate rows (where the entire tuple/row is the same)
print("\n=== Checking for exact duplicate rows (all columns match) ===")
duplicates = df.duplicated()
duplicate_count = duplicates.sum()
print(f"Found {duplicate_count} exact duplicate rows in the dataset")

if duplicate_count > 0:
    # Remove duplicates and save the deduplicated dataset
    deduplicated_df = df.drop_duplicates(keep='first')
    deduplicated_file = r"c:\Users\jayto\Downloads\Codeshastra\Hackathon_Dataset_Deduplicated.csv"
    deduplicated_df.to_csv(deduplicated_file, index=False)
    print(f"\nRemoved {len(df) - len(deduplicated_df)} duplicate rows")
    print(f"Deduplicated dataset saved to: {deduplicated_file}")
else:
    print("No duplicate rows found in the dataset.")