import pandas as pd
import os

# Define file paths
base_dir = '/Users/shubhjyot/Desktop/area_datasets'
files = [
    'cleaned_area_Home Delivery.csv',
    'cleaned_area_Parcel.csv',
    'cleaned_area_Swiggy.csv',
    'cleaned_area_Zomato.csv'
]

# Read each dataset
dataframes = []
for file in files:
    file_path = os.path.join(base_dir, file)
    # Read the file and add a source column to track origin
    df = pd.read_csv(file_path)
    source = file.replace('cleaned_area_', '').replace('.csv', '')
    # Ensure data_source is a simple string, not a list or other complex object
    df['data_source'] = source
    dataframes.append(df)
    print(f"Loaded {file} with {len(df)} rows and {len(df.columns)} columns")

# Identify common columns across all datasets
common_columns = set(dataframes[0].columns)
for df in dataframes[1:]:
    common_columns = common_columns.intersection(set(df.columns))

print(f"\nFound {len(common_columns)} common columns across all datasets:")
print(sorted(list(common_columns)))

# Select only common columns plus the source column for each dataframe
standardized_dfs = []
for i, df in enumerate(dataframes):
    # Select common columns plus the source column we added
    selected_cols = list(common_columns) + ['data_source']
    # Remove duplicates if any
    selected_cols = list(dict.fromkeys(selected_cols))
    standardized_df = df[selected_cols].copy()
    # Ensure data_source is a string column
    standardized_df['data_source'] = standardized_df['data_source'].astype(str)
    standardized_dfs.append(standardized_df)
    print(f"Standardized dataset {i+1} to {len(standardized_df.columns)} columns")

# Concatenate all dataframes
merged_df = pd.concat(standardized_dfs, ignore_index=True)
print(f"\nMerged dataset has {len(merged_df)} rows and {len(merged_df.columns)} columns")

# Save the merged dataset
output_path = os.path.join(base_dir, 'merged_orders.csv')
merged_df.to_csv(output_path, index=False)
print(f"Merged dataset saved to {output_path}")

# Optional: Generate a summary of the merged data
print("\nSummary of merged data:")
print(f"Total orders: {len(merged_df)}")
print(f"Orders by source:")
# Fix the value_counts issue by ensuring data_source is a simple string column
print(merged_df['data_source'].astype(str).value_counts())
print("\nDate range:")
if 'Date' in merged_df.columns:
    print(f"Earliest date: {merged_df['Date'].min()}")
    print(f"Latest date: {merged_df['Date'].max()}")