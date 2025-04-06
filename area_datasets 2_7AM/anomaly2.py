import pandas as pd
import numpy as np

def process_dataset(file_path, output_path):
    # Load the dataset with all columns preserved
    df = pd.read_csv(file_path)
    print(f"\nProcessing '{file_path}' with {df.shape[0]} rows and {df.shape[1]} columns")
    
    # Convert known date columns to datetime if they exist
    date_cols = ['Date', 'First_Print_Date_BSR', 'Last_Settlement_Date_BSR']
    for col in date_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce', dayfirst=True)
            missing = df[col].isnull().sum()
            print(f"Converted column '{col}' to datetime. Missing/invalid dates: {missing}")
    
    # ---------------------------
    # Anomaly Flags / Feature Engineering
    # ---------------------------
    
    
    # 2. High Discount Amount Flag
    if 'Final_Total' in df.columns and 'Discount' in df.columns:
        df['flag_discount_high'] = np.where(
            (df['Final_Total'] > 0) & ((df['Discount'] / df['Final_Total']) > 0.25),
            1,
            0
        )
    else:
        df['flag_discount_high'] = np.nan
    
    # 3. Order Cancelled with No Reason Flag
    if 'Status' in df.columns:
        df['flag_order_cancelled_no_reason'] = np.where(
            df['Status'].str.lower() == 'cancelled',
            1,
            0
        )
    else:
        df['flag_order_cancelled_no_reason'] = np.nan
    
    # 4. Service Charge vs. Actual Total Mismatch Flag
    if all(col in df.columns for col in ['Sub_Total', 'Service_Charge_Amount', 'Tax', 'Final_Total']):
        df['expected_total'] = df['Sub_Total'] + df['Service_Charge_Amount'] + df['Tax']
        tolerance = 0.05 * df['expected_total']
        df['flag_service_charge_mismatch'] = np.where(
            (df['Final_Total'] - df['expected_total']).abs() > tolerance,
            1,
            0
        )
    else:
        df['flag_service_charge_mismatch'] = np.nan
    
    # 5. Huge Time Difference Between Print Dates Flag
    if 'First_Print_Date_BSR' in df.columns and 'Last_Settlement_Date_BSR' in df.columns:
        df['print_date_diff'] = (df['Last_Settlement_Date_BSR'] - df['First_Print_Date_BSR']).dt.days
        df['flag_huge_time_diff'] = np.where(
            df['print_date_diff'] > 5,
            1,
            0
        )
    else:
        df['flag_huge_time_diff'] = np.nan
    
    # 6. Price Modification Flag (allowing only significant variations)
    if 'Variation' in df.columns:
        df['Variation_numeric'] = pd.to_numeric(df['Variation'], errors='coerce')
        if 'Price' in df.columns:
            df['variation_pct'] = np.where(df['Price'] != 0, df['Variation_numeric'] / df['Price'], np.nan)
            df['flag_price_modification'] = np.where(
                df['variation_pct'].abs() > 0.05,  # flag if variation > 5% of Price
                1,
                0
            )
        else:
            df['flag_price_modification'] = np.where(
                df['Variation'].notnull() & (df['Variation'] != ''),
                1,
                0
            )
    else:
        df['flag_price_modification'] = np.nan
    
    # 7. Zero Price or Subtotal Flag
    if 'Price' in df.columns and 'Sub_Total' in df.columns:
        df['flag_zero_price_or_subtotal'] = np.where(
            (df['Price'] == 0) | (df['Sub_Total'] == 0),
            1,
            0
        )
    else:
        df['flag_zero_price_or_subtotal'] = np.nan
    
    # 8. Complimentary Order with Price Charged Flag
    if 'Order_Type' in df.columns and 'Final_Total' in df.columns:
        df['flag_complimentary_price_charged'] = np.where(
            (df['Order_Type'].str.lower() == 'complimentary') & (df['Final_Total'] > 0),
            1,
            0
        )
    else:
        df['flag_complimentary_price_charged'] = np.nan
    
    # 9. Tax Mismatch Flag: Check if Tax roughly equals the sum of CGST_Amount, SGST_Amount, and VAT_Amount
    if all(col in df.columns for col in ['Tax', 'CGST_Amount', 'SGST_Amount', 'VAT_Amount']):
        tax_sum = df['CGST_Amount'] + df['SGST_Amount'] + df['VAT_Amount']
        tolerance_tax = 0.03 * tax_sum
        df['flag_tax_mismatch'] = np.where(
            (df['Tax'] - tax_sum).abs() > tolerance_tax,
            1,
            0
        )
    else:
        df['flag_tax_mismatch'] = np.nan

    # 10. Missing Address with Completed Delivery Flag
    # Flag orders where Status is 'Completed' but the Address is missing or empty.
    if 'Address' in df.columns and 'Status' in df.columns:
        df['flag_missing_address_completed'] = np.where(
            (df['Status'].str.lower() == 'completed') & 
            ((df['Address'].isnull()) | (df['Address'].str.strip() == "")),
            1,
            0
        )
    else:
        df['flag_missing_address_completed'] = np.nan
    
    # ---------------------------
    # Print Summary of Flags
    # ---------------------------
    flag_cols = [col for col in df.columns if col.startswith('flag_')]
    print("\nAnomaly Flag Counts:")
    for col in flag_cols:
        if pd.api.types.is_numeric_dtype(df[col]):
            print(f"{col}: {df[col].sum()}")
        else:
            print(f"{col}: Not computed (missing required columns)")
    
    # Save the processed dataset with the new anomaly flags
    df.to_csv(output_path, index=False)
    print(f"Processed dataset saved to '{output_path}'")

# List of new datasets to process with their respective output file paths
new_datasets = [
    ('/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Dine in.csv', 
     '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Dine_in_features.csv'),
    ('/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Garden Table.csv', 
     '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Garden_Table_features.csv'),
    ('/Users/shubhjyot/Desktop/area_datasets/cleaned_area_PARTY.csv', 
     '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_PARTY_features.csv'),
    ('/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Personal Dine In Room.csv', 
     '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Personal_Dine_In_Room_features.csv'),
    ('/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Home Delivery.csv', 
     '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Home_Delivery_features.csv'),
    ('/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Parcel.csv', 
     '/Users/shubhjyot/Desktop/area_datasets/cleaned_area_Parcel_features.csv'),
]

# Process each dataset individually
for input_file, output_file in new_datasets:
    process_dataset(input_file, output_file)
