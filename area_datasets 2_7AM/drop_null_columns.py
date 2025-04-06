import pandas as pd
import os
import glob

# Define the directory containing the CSV files
datasets_dir = r"c:\Users\jayto\Downloads\Codeshastra\area_datasets"

# Get all CSV files in the directory
csv_files = glob.glob(os.path.join(datasets_dir, "*.csv"))

# Process each CSV file
for file_path in csv_files:
    # Extract file name for reporting
    file_name = os.path.basename(file_path)
    
    try:
        # Read the CSV file
        print(f"Processing {file_name}...")
        df = pd.read_csv(file_path)
        
        # Get original column count
        original_columns = len(df.columns)
        
        # Identify columns that are 100% null
        null_columns = [col for col in df.columns if df[col].isna().all()]
        
        if null_columns:
            # Drop the 100% null columns
            df_cleaned = df.drop(columns=null_columns)
            
            # Create output file path
            output_file = os.path.join(datasets_dir, f"cleaned_{file_name}")
            
            # Save the cleaned dataframe
            df_cleaned.to_csv(output_file, index=False)
            
            # Report results
            print(f"  Removed {len(null_columns)} columns that were 100% null")
            print(f"  Original columns: {original_columns}, Remaining columns: {len(df_cleaned.columns)}")
            print(f"  Saved cleaned file to: {output_file}")
            
            # Optionally, list the removed columns
            if len(null_columns) > 0:
                print(f"  Removed columns: {', '.join(null_columns[:10])}" + 
                      (f" and {len(null_columns) - 10} more..." if len(null_columns) > 10 else ""))
        else:
            print(f"  No columns with 100% null values found in {file_name}")
        
    except Exception as e:
        print(f"Error processing {file_name}: {e}")
    
    print("\n" + "="*70 + "\n")

print("Processing complete!")