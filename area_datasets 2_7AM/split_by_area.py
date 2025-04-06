import pandas as pd
import os

# Define the file path
file_path = r"c:\Users\jayto\Downloads\Codeshastra\detailed_grouped_entries.csv"

# Check if the file exists
if not os.path.exists(file_path):
    print(f"Error: File not found at {file_path}")
    exit(1)

# Read the CSV file
try:
    data = pd.read_csv(file_path)
    print(f"Successfully loaded CSV with {len(data)} rows and {len(data.columns)} columns")
    
    # Check if Area column exists
    if 'Area' not in data.columns:
        print(f"Error: 'Area' column not found in the dataset")
        print(f"Available columns: {', '.join(data.columns)}")
        exit(1)
        
    # Get unique areas
    unique_areas = data['Area'].unique()
    print(f"Found {len(unique_areas)} unique areas in the dataset")
    
    # Create output directory if it doesn't exist
    output_dir = r"c:\Users\jayto\Downloads\Codeshastra\area_datasets"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created output directory: {output_dir}")
    
    # Split the dataset by area
    for area in unique_areas:
        # Filter data for this area
        area_data = data[data['Area'] == area]
        
        # Create a valid filename (replace invalid characters)
        area_filename = str(area).replace('/', '_').replace('\\', '_').replace(':', '_').replace('*', '_').replace('?', '_').replace('"', '_').replace('<', '_').replace('>', '_').replace('|', '_')
        
        # Save to CSV
        output_file = os.path.join(output_dir, f"area_{area_filename}.csv")
        area_data.to_csv(output_file, index=False)
        print(f"Saved {len(area_data)} rows for area '{area}' to {output_file}")
    
    # Also create a summary file
    area_counts = data['Area'].value_counts().reset_index()
    area_counts.columns = ['Area', 'Count']
    summary_file = r"c:\Users\jayto\Downloads\Codeshastra\area_summary.csv"
    area_counts.to_csv(summary_file, index=False)
    print(f"\nSaved area summary to {summary_file}")
    
    # Print the top areas by count
    print("\nTop 10 areas by count:")
    print(area_counts.head(10))
    
except Exception as e:
    print(f"Error processing CSV file: {e}")
    exit(1)