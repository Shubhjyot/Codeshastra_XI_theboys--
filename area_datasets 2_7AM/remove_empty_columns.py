import pandas as pd
import os

# Define the file path
file_path = r"c:\Users\jayto\Downloads\Codeshastra\Hackathon_Dataset_Deduplicated.csv"

# Check if the file exists
if not os.path.exists(file_path):
    print(f"Error: File not found at {file_path}")
    exit(1)

# Read the CSV file
try:
    df = pd.read_csv(file_path)
    print(f"Successfully loaded CSV with {len(df)} rows and {len(df.columns)} columns")
    print(f"Original columns: {len(df.columns)}")
except Exception as e:
    print(f"Error reading CSV file: {e}")
    exit(1)

# Identify completely empty columns
empty_columns = [col for col in df.columns if df[col].isna().all()]
print(f"\nFound {len(empty_columns)} completely empty columns:")
if empty_columns:
    print(", ".join(empty_columns))

    # Remove empty columns
    df_cleaned = df.drop(columns=empty_columns)
    
    # Save the cleaned dataset
    cleaned_file = r"c:\Users\jayto\Downloads\Codeshastra\Hackathon_Dataset_Cleaned.csv"
    df_cleaned.to_csv(cleaned_file, index=False)
    
    print(f"\nRemoved {len(empty_columns)} empty columns")
    print(f"Dataset with empty columns removed saved to: {cleaned_file}")
    print(f"Remaining columns: {len(df_cleaned.columns)}")
else:
    print("No completely empty columns found in the dataset.")

# Group data by invoice number, timestamp, and date
print("\n=== Grouping data by invoice number, timestamp, and date ===")

# Use the specified column names
invoice_col = 'Invoice_No_'
timestamp_col = 'Timestamp'
date_col = 'Date'

# Verify that the columns exist in the dataframe
missing_columns = []
for col in [invoice_col, timestamp_col, date_col]:
    if col not in df.columns:
        missing_columns.append(col)

if missing_columns:
    print(f"Error: The following columns are missing from the dataset: {', '.join(missing_columns)}")
    print("Available columns:", ", ".join(df.columns))
else:
    # Group all data by the three columns and save to CSV
    print(f"Grouping all data by {invoice_col}, {timestamp_col}, and {date_col}...")
    
    # Add a group ID column to identify each unique group
    df_with_groups = df.copy()
    df_with_groups['group_id'] = df_with_groups[invoice_col].astype(str) + '_' + \
                                df_with_groups[timestamp_col].astype(str) + '_' + \
                                df_with_groups[date_col].astype(str)
    
    # Sort by the grouping columns to keep related records together
    df_with_groups = df_with_groups.sort_values(by=[invoice_col, timestamp_col, date_col])
    
    # Save the grouped dataset
    grouped_file = r"c:\Users\jayto\Downloads\Codeshastra\Hackathon_Dataset_Grouped.csv"
    df_with_groups.to_csv(grouped_file, index=False)
    print(f"Complete dataset with group IDs saved to: {grouped_file}")
    
    # Also create a summary file with group counts
    grouped = df.groupby([invoice_col, timestamp_col, date_col])
    group_sizes = grouped.size().reset_index(name='count')
    group_sizes = group_sizes.sort_values('count', ascending=False)
    
    # Save the summary
    summary_file = r"c:\Users\jayto\Downloads\Codeshastra\Group_Summary.csv"
    group_sizes.to_csv(summary_file, index=False)
    print(f"Group summary with counts saved to: {summary_file}")
    
    # Print some statistics
    print(f"\nTotal number of unique groups: {len(group_sizes)}")
    print(f"Groups with multiple entries: {len(group_sizes[group_sizes['count'] > 1])}")
    print(f"Maximum entries in a single group: {group_sizes['count'].max()}")