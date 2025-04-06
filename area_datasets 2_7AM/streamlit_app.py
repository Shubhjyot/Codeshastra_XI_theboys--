import os
import base64
import time
import tempfile
from io import BytesIO
from typing import List
import glob
import json

import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

import faiss
from sentence_transformers import SentenceTransformer
import google.generativeai as genai

# ReportLab for PDF generation
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

# ---------------------------
# GeminiRAG Class Definition
# ---------------------------
class GeminiRAG:
    def __init__(self, embedding_model: str = 'all-MiniLM-L6-v2'):
        # Try to initialize the Gemini model
        try:
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            st.sidebar.success("Using model: gemini-2.0-flash")
        except Exception as e:
            st.sidebar.error(f"Error with gemini-2.0-flash: {e}")
            try:
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                st.sidebar.success("Using model: gemini-1.5-flash")
            except Exception as e:
                st.sidebar.error(f"Error with gemini-1.5-flash: {e}")
                raise ValueError("No suitable Gemini models available")
        
        st.sidebar.info(f"Loading embedding model: {embedding_model}")
        self.embedding_model = SentenceTransformer(embedding_model)
        
        # Initialize knowledge base containers
        self.documents = []  # Original documents
        self.chunks = []     # Chunked text
        self.embeddings = [] # Vector embeddings
        
        # Create directory for storing embeddings if needed
        os.makedirs('embeddings', exist_ok=True)
    
    def _chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 100) -> List[str]:
        """Split text into overlapping chunks."""
        if len(text) > 1000000:  # Large text
            st.sidebar.info(f"Large text detected ({len(text)/1000000:.2f}MB). Using memory-efficient chunking...")
            chunks = []
            segment_size = 100000
            for i in range(0, len(text), segment_size):
                segment = text[i:i+segment_size]
                start = 0
                while start < len(segment):
                    end = min(start + chunk_size, len(segment))
                    if start > 0 or i > 0:
                        start_with_overlap = max(0, start - overlap)
                        chunks.append(segment[start_with_overlap:end])
                    else:
                        chunks.append(segment[start:end])
                    start = end
            return chunks
        else:
            chunks = []
            start = 0
            while start < len(text):
                end = min(start + chunk_size, len(text))
                if start > 0:
                    start_with_overlap = max(0, start - overlap)
                    chunks.append(text[start_with_overlap:end])
                else:
                    chunks.append(text[start:end])
                start = end
            return chunks
    
    def generate_report(self, prompt: str, temperature: float = 0.7, max_output_tokens: int = 1500) -> str:
        """Generate a report using the Gemini model."""
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": max_output_tokens
                }
            )
            if response:
                return response.text
            else:
                st.error("Error generating report from Gemini model.")
                return ""
        except Exception as e:
            st.error(f"Error generating report: {e}")
            return ""
    
    def add_documents(self, documents: List[str]):
        """Add documents to the knowledge base and update embeddings."""
        self.documents.extend(documents)
        for doc in documents:
            chunks = self._chunk_text(doc)
            self.chunks.extend(chunks)
        if self.chunks:
            st.sidebar.info(f"Generating embeddings for {len(self.chunks)} chunks...")
            self.embeddings = self.embedding_model.encode(self.chunks)
            st.sidebar.success("Embeddings generated successfully.")
    
    def query(self, query_text: str, top_k: int = 5) -> List[str]:
        """Query the knowledge base and return the most relevant chunks."""
        if not self.chunks or len(self.embeddings) == 0:
            return []
        query_embedding = self.embedding_model.encode([query_text])[0]
        similarities = np.dot(self.embeddings, query_embedding) / (
            np.linalg.norm(self.embeddings, axis=1) * np.linalg.norm(query_embedding)
        )
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        return [self.chunks[i] for i in top_indices]

# ---------------------------
# Data Processing: Process a CSV file and add anomaly flags
# ---------------------------
def process_dataset_file(file_path: str, output_path: str):
    df = pd.read_csv(file_path)
    
    # Convert date columns if they exist
    date_cols = ['Date', 'First_Print_Date_BSR', 'Last_Settlement_Date_BSR']
    for col in date_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce', format='%Y-%m-%d %H:%M:%S')
    
    # 2. High Discount Amount Flag
    if 'Final_Total' in df.columns and 'Discount' in df.columns:
        df['flag_discount_high'] = np.where(
            (df['Final_Total'] > 0) & ((df['Discount'] / df['Final_Total']) > 0.25),
            1, 0
        )
    else:
        df['flag_discount_high'] = np.nan
    
    # 3. Order Cancelled with No Reason Flag
    if 'Status' in df.columns:
        df['flag_order_cancelled_no_reason'] = np.where(
            df['Status'].str.lower() == 'cancelled',
            1, 0
        )
    else:
        df['flag_order_cancelled_no_reason'] = np.nan
    
    # 4. Service Charge vs. Actual Total Mismatch Flag
    if all(col in df.columns for col in ['Sub_Total', 'Service_Charge_Amount', 'Tax', 'Final_Total']):
        # Check if the file name contains zomato or swiggy (case insensitive)
        if "zomato" in file_path.lower() or "swiggy" in file_path.lower():
            # Skip the rule for Zomato or Swiggy datasets
            df['flag_service_charge_mismatch'] = 0
        else:
            # Apply the rule for other datasets
            df['expected_total'] = df['Sub_Total'] + df['Service_Charge_Amount'] + df['Tax']
            tolerance = 0.05 * df['expected_total']
            df['flag_service_charge_mismatch'] = np.where(
                (df['Final_Total'] - df['expected_total']).abs() > tolerance,
                1, 0
            )
    else:
        df['flag_service_charge_mismatch'] = np.nan
    
    # 5. Huge Time Difference Between Print Dates Flag
    if 'First_Print_Date_BSR' in df.columns and 'Last_Settlement_Date_BSR' in df.columns:
        df['print_date_diff'] = (df['Last_Settlement_Date_BSR'] - df['First_Print_Date_BSR']).dt.days
        df['flag_huge_time_diff'] = np.where(
            df['print_date_diff'] > 5,
            1, 0
        )
    else:
        df['flag_huge_time_diff'] = np.nan
    
    # 6. Price Modification Flag
    if 'Variation' in df.columns:
        df['Variation_numeric'] = pd.to_numeric(df['Variation'], errors='coerce')
        if 'Price' in df.columns:
            df['variation_pct'] = np.where(df['Price'] != 0, df['Variation_numeric'] / df['Price'], np.nan)
            df['flag_price_modification'] = np.where(
                df['variation_pct'].abs() > 0.05,
                1, 0
            )
        else:
            df['flag_price_modification'] = np.where(
                df['Variation'].notnull() & (df['Variation'] != ''),
                1, 0
            )
    else:
        df['flag_price_modification'] = np.nan
    
    # 7. Zero Price or Subtotal Flag
    if 'Price' in df.columns and 'Sub_Total' in df.columns:
        df['flag_zero_price_or_subtotal'] = np.where(
            (df['Price'] == 0) | (df['Sub_Total'] == 0),
            1, 0
        )
    else:
        df['flag_zero_price_or_subtotal'] = np.nan
    
    # 8. Complimentary Order with Price Charged Flag
    if 'Order_Type' in df.columns and 'Final_Total' in df.columns:
        df['flag_complimentary_price_charged'] = np.where(
            (df['Order_Type'].str.lower() == 'complimentary') & (df['Final_Total'] > 0),
            1, 0
        )
    else:
        df['flag_complimentary_price_charged'] = np.nan
    
    # 9. Tax Mismatch Flag
    if all(col in df.columns for col in ['Tax', 'CGST_Amount', 'SGST_Amount', 'VAT_Amount']):
        tax_sum = df['CGST_Amount'] + df['SGST_Amount'] + df['VAT_Amount'] + df['Service_Charge_Amount']
        tolerance_tax = 0.1 * tax_sum
        df['flag_tax_mismatch'] = np.where(
            (df['Tax'] - tax_sum).abs() > tolerance_tax,
            1, 0
        )
    else:
        df['flag_tax_mismatch'] = np.nan
    
    # 10. Discount Approval Flag - Check if discount is given but not approved
    if all(col in df.columns for col in ['Discount', 'Discount_DRS', 'Reason_DSR']):
        df['flag_discount_not_approved'] = np.where(
            (df['Discount'] > 0) & (
                (df['Discount_DRS'].isnull()) | (df['Discount_DRS'] == '') |
                (df['Reason_DSR'].isnull()) | (df['Reason_DSR'] == '')
            ),
            1, 0
        )
    else:
        df['flag_discount_not_approved'] = np.nan
    
    # 11. Missing Address with Completed Delivery Flag
    if 'Address' in df.columns and 'Status' in df.columns:
        df['flag_missing_address_completed'] = np.where(
            (df['Status'].str.lower() == 'completed') & ((df['Address'].isnull()) | (df['Address'].str.strip() == "")),
            1, 0
        )
    else:
        df['flag_missing_address_completed'] = np.nan

    # (Removed the block that logged the anomaly flag counts.)

    # Save processed file
    df.to_csv(output_path, index=False)
    # Removing the success message that appears on the UI
    # st.success(f"Processed dataset saved to '{output_path}'")
    return df

# ---------------------------
# Data Preprocessing Functions
# ---------------------------
def find_duplicates(df):
    duplicates = df.duplicated()
    duplicate_count = duplicates.sum()
    if duplicate_count > 0:
        deduplicated_df = df.drop_duplicates(keep='first')
        return deduplicated_df
    else:
        return df

def remove_empty_columns(df):
    empty_columns = [col for col in df.columns if df[col].isna().all()]
    if empty_columns:
        df_cleaned = df.drop(columns=empty_columns)
        return df_cleaned
    else:
        return df

def split_by_area(df):
    if 'Area' not in df.columns:
        return {"All Data": df}
    unique_areas = df['Area'].unique()
    area_dfs = {}
    for area in unique_areas:
        area_key = str(area).replace('/', '_').replace('\\', '_') \
                            .replace(':', '_').replace('*', '_') \
                            .replace('?', '_').replace('"', '_') \
                            .replace('<', '_').replace('>', '_') \
                            .replace('|', '_')
        area_key = f"area_{area_key}"
        area_dfs[area_key] = df[df['Area'] == area]
    return area_dfs

def drop_null_columns(df):
    null_columns = [col for col in df.columns if df[col].isna().all()]
    if null_columns:
        df_cleaned = df.drop(columns=null_columns)
        return df_cleaned
    else:
        return df

def preprocess_data(df):
    df = find_duplicates(df)
    df = remove_empty_columns(df)
    df = drop_null_columns(df)
    area_dfs = split_by_area(df)
    return area_dfs

# ---------------------------
# Main Streamlit App
# ---------------------------
def main():
    # Update page configuration with a more modern look
    st.set_page_config(
        page_title="FinFlagger | Anomaly Detection",
        page_icon="🚩",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    # Configure API key for GenAI
    API_KEY = "AIzaSyAY1xvGbIulUUMQTHbs1IbVx3K51fSxEQI"  # Replace with your actual key
    genai.configure(api_key=API_KEY)
    
    # Add a standard title for the app
    st.title("🚩 FinFlagger")
    st.subheader("AI-Powered Financial Anomaly Detection")
    
    # Modernize sidebar
    st.sidebar.markdown("""
    <div style="text-align: center; margin-bottom: 20px;">
        <h3 style="margin-bottom: 5px;">Control Panel</h3>
        <p style="color: #a8b2d1; font-size: 0.9rem;">Configure your analysis</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Sidebar: File uploader and sample data option
    st.sidebar.header("Data Input")
    uploaded_files = st.sidebar.file_uploader("Upload CSV files", type=["csv"], accept_multiple_files=True)
    use_sample_data = st.sidebar.checkbox("Use sample data", value=False)  # Changed default to False
    
    # Add preprocessing options
    st.sidebar.header("Preprocessing Options")
    run_preprocessing = st.sidebar.checkbox("Run preprocessing pipeline", value=True)
    
    # Session state initialization
    if 'processed_dfs' not in st.session_state:
        st.session_state.processed_dfs = {}
    if 'anomaly_summary_df' not in st.session_state:
        st.session_state.anomaly_summary_df = None
    if 'figures' not in st.session_state:
        st.session_state.figures = {}
    if 'report_generated' not in st.session_state:
        st.session_state.report_generated = False
    if 'gemini_rag' not in st.session_state:
        st.session_state.gemini_rag = GeminiRAG()
    
    # Define file paths for sample data (adjust these paths as needed)
    sample_files = [
        r'c:\Users\jayto\Desktop\area_datasets 2\area_datasets 2\cleaned_area_Dine_in.csv',
        r'c:\Users\jayto\Desktop\area_datasets 2\area_datasets 2\cleaned_area_Garden_Table.csv',
        r'c:\Users\jayto\Desktop\area_datasets 2\area_datasets 2\cleaned_area_PARTY.csv',
        r'c:\Users\jayto\Desktop\area_datasets 2\area_datasets 2\cleaned_area_Personal_Dine_In_Room.csv'
    ]
    
    dfs = {}
    if uploaded_files or use_sample_data:
        # Create a progress bar for the data processing steps
        progress_bar = st.progress(0)
        status_text = st.empty()
        
        # Step 1: Loading data
        status_text.text("Step 1/4: Loading data files...")
        
        if uploaded_files:
            for i, file in enumerate(uploaded_files):
                try:
                    df = pd.read_csv(file)
                    dfs[file.name] = df
                    # Update progress based on file loading
                    progress_bar.progress((i + 1) / len(uploaded_files) * 0.25)
                except Exception as e:
                    # st.error(f"Error loading {file.name}: {e}")
                    print(f"Error loading {file.name}: {e}")
        elif use_sample_data:
            for i, path in enumerate(sample_files):
                try:
                    df = pd.read_csv(path)
                    dfs[os.path.basename(path)] = df
                    # Update progress based on sample file loading
                    progress_bar.progress((i + 1) / len(sample_files) * 0.25)
                except Exception as e:
                    # st.error(f"Error loading {path}: {e}")
                    print(f"Error loading {path}: {e}")
        
        # Step 2: Preprocessing
        status_text.text("Step 2/4: Preprocessing datasets...")
        progress_bar.progress(0.25)
        
        if run_preprocessing:
            preprocessed_dfs = {}
            for i, (name, df) in enumerate(dfs.items()):
                area_dfs = preprocess_data(df)
                
                # Add each area dataframe to the preprocessed_dfs dictionary
                for area_name, area_df in area_dfs.items():
                    preprocessed_dfs[f"{name}_{area_name}"] = area_df
                
                # Update progress for preprocessing step
                progress_bar.progress(0.25 + (i + 1) / len(dfs) * 0.25)
            
            # Replace the original dfs with preprocessed ones
            dfs = preprocessed_dfs
        else:
            progress_bar.progress(0.5)
        
        # Step 3: Processing datasets
        status_text.text("Step 3/4: Processing datasets and detecting anomalies...")
        processed_dfs = {}
        for i, (name, df) in enumerate(dfs.items()):
            output_path = os.path.join(tempfile.gettempdir(), f"processed_{name.replace(' ', '_')}")
            temp_input_path = os.path.join(tempfile.gettempdir(), name.replace(" ", "_"))
            df.to_csv(temp_input_path, index=False)
            input_path = temp_input_path
            
            try:
                processed_df = process_dataset_file(input_path, output_path)
                processed_dfs[name] = processed_df
            except Exception as e:
                # st.error(f"Error processing {name}: {e}")
                print(f"Error processing {name}: {e}")
            
            progress_bar.progress(0.5 + (i + 1) / len(dfs) * 0.25)
        
        st.session_state.processed_dfs = processed_dfs
        
        # Step 4: Creating anomaly summary
        status_text.text("Step 4/4: Creating anomaly summary...")
        progress_bar.progress(0.75)
        
        anomaly_flags = [
            'flag_discount_not_approved',
            'flag_discount_high',
            'flag_order_cancelled_no_reason',
            'flag_service_charge_mismatch',
            'flag_huge_time_diff',
            'flag_price_modification',
            'flag_zero_price_or_subtotal',
            'flag_complimentary_price_charged',
            'flag_tax_mismatch',
            'flag_missing_address_completed'
        ]
        summary_list = []
        for name, df in processed_dfs.items():
            dataset_summary = {'Dataset': name}
            for flag in anomaly_flags:
                dataset_summary[flag] = df[flag].sum() if flag in df.columns else 0
            summary_list.append(dataset_summary)
        anomaly_summary_df = pd.DataFrame(summary_list)
        st.session_state.anomaly_summary_df = anomaly_summary_df
        
        progress_bar.progress(1.0)
        status_text.text("Data processing complete!")
        time.sleep(1)
        status_text.empty()
        progress_bar.empty()
    
    if dfs:
        # Removing sidebar info messages
        # st.sidebar.info("Processing datasets...")
        
        if run_preprocessing:
            preprocessed_dfs = {}
            for name, df in dfs.items():
                # st.sidebar.info(f"Preprocessing {name}...")
                area_dfs = preprocess_data(df)
                for area_name, area_df in area_dfs.items():
                    preprocessed_dfs[f"{name}_{area_name}"] = area_df
            dfs = preprocessed_dfs
        
        processed_dfs = {}
        for name, df in dfs.items():
            output_path = os.path.join(tempfile.gettempdir(), f"processed_{name.replace(' ', '_')}")
            temp_input_path = os.path.join(tempfile.gettempdir(), name.replace(" ", "_"))
            df.to_csv(temp_input_path, index=False)
            input_path = temp_input_path
            
            try:
                processed_df = process_dataset_file(input_path, output_path)
                processed_dfs[name] = processed_df
            except Exception as e:
                # st.error(f"Error processing {name}: {e}")
                print(f"Error processing {name}: {e}")
        st.session_state.processed_dfs = processed_dfs
        
        anomaly_flags = [
            'flag_discount_not_approved',
            'flag_discount_high',
            'flag_order_cancelled_no_reason',
            'flag_service_charge_mismatch',
            'flag_huge_time_diff',
            'flag_price_modification',
            'flag_zero_price_or_subtotal',
            'flag_complimentary_price_charged',
            'flag_tax_mismatch',
            'flag_missing_address_completed'
        ]
        summary_list = []
        for name, df in processed_dfs.items():
            dataset_summary = {'Dataset': name}
            for flag in anomaly_flags:
                dataset_summary[flag] = df[flag].sum() if flag in df.columns else 0
            summary_list.append(dataset_summary)
        anomaly_summary_df = pd.DataFrame(summary_list)
        st.session_state.anomaly_summary_df = anomaly_summary_df
        
        st.sidebar.success("Data processing complete!")
    
    tab1, tab2, tab3, tab4 = st.tabs(["Dashboard", "Detailed Analysis", "Report Generator", "Chatbot"])
    
    # ---------------------------
    # Tab 1: Dashboard
    # ---------------------------
    with tab1:
        st.header("Anomaly Detection Dashboard")
        if st.session_state.anomaly_summary_df is not None:
            col1, col2 = st.columns(2)
            
            risk_categories = {
                'high': ['flag_discount_not_approved', 'flag_service_charge_mismatch', 'flag_tax_mismatch'],
                'medium': ['flag_discount_high', 'flag_price_modification', 'flag_complimentary_price_charged'],
                'low': ['flag_order_cancelled_no_reason', 'flag_huge_time_diff', 'flag_zero_price_or_subtotal', 'flag_missing_address_completed']
            }
            
            with col1:
                risk_df = pd.DataFrame({
                    'Risk Level': ['High Risk', 'Medium Risk', 'Low Risk'],
                    'Count': [
                        st.session_state.anomaly_summary_df[risk_categories['high']].sum().sum(),
                        st.session_state.anomaly_summary_df[risk_categories['medium']].sum().sum(),
                        st.session_state.anomaly_summary_df[risk_categories['low']].sum().sum()
                    ]
                })
                
                fig_risk = px.bar(risk_df,
                                  x='Risk Level',
                                  y='Count',
                                  title="Anomalies by Risk Level",
                                  color='Risk Level',
                                  color_discrete_map={'High Risk': 'red', 'Medium Risk': 'orange', 'Low Risk': 'green'})
                fig_risk.update_layout(height=400)
                st.plotly_chart(fig_risk, use_container_width=True)
                st.session_state.figures['risk_levels'] = fig_risk
            
            with col2:
                total_anomaly_counts = st.session_state.anomaly_summary_df[anomaly_flags].sum()
                fig_pie = px.pie(
                    values=total_anomaly_counts.values,
                    names=[flag.replace("flag_", "").replace("_", " ").title() for flag in total_anomaly_counts.index],
                    title="Anomaly Type Distribution"
                )
                fig_pie.update_layout(height=400)
                st.plotly_chart(fig_pie, use_container_width=True)
                st.session_state.figures['anomaly_pie'] = fig_pie
            
            fig_heatmap = px.imshow(
                st.session_state.anomaly_summary_df.set_index("Dataset")[anomaly_flags].fillna(0),
                title="Heatmap of Anomalies by Dataset",
                color_continuous_scale="Viridis"
            )
            fig_heatmap.update_layout(height=500)
            st.plotly_chart(fig_heatmap, use_container_width=True)
            st.session_state.figures['heatmap'] = fig_heatmap
            
            st.subheader("AI Insights")
            with st.spinner("Generating insights..."):
                anomaly_summary = st.session_state.anomaly_summary_df.to_markdown()
                insight_prompt = f"""
                You are a financial forensic analyst. Based on the following anomaly summary data, provide 3-5 key insights about the patterns and potential issues:
                
                {anomaly_summary}
                
                Focus on the most significant anomalies, potential risk areas, and actionable recommendations.
                Keep your response concise and bullet-pointed.
                """
                insights = st.session_state.gemini_rag.generate_report(insight_prompt, temperature=0.3, max_output_tokens=800)
                if insights:
                    st.markdown(insights)
                else:
                    st.info("Could not generate AI insights. Please try again later.")
        else:
            st.info("No data available. Please upload or use sample data.")
    
    # ---------------------------
    # Tab 2: Detailed Analysis
    # ---------------------------
    with tab2:
        st.header("Detailed Anomaly Analysis")
        if st.session_state.anomaly_summary_df is not None:
            selected_dataset = st.selectbox("Select a dataset", options=st.session_state.anomaly_summary_df["Dataset"].tolist())
            selected_row = st.session_state.anomaly_summary_df[st.session_state.anomaly_summary_df["Dataset"] == selected_dataset].iloc[0]
            selected_df = st.session_state.processed_dfs.get(selected_dataset)
            
            analysis_tabs = st.tabs(["Anomaly Distribution", "Correlation Analysis", "Data Samples", "AI Analysis"])
            
            with analysis_tabs[0]:
                col1, col2 = st.columns(2)
                labels = [flag.replace("flag_", "").replace("_", " ").title() for flag in anomaly_flags]
                values = [selected_row[flag] for flag in anomaly_flags]
                fig_dataset = px.bar(
                    x=labels,
                    y=values,
                    title=f"Anomaly Distribution for {selected_dataset}",
                    labels={'x': 'Anomaly Type', 'y': 'Count'}
                )
                col1.plotly_chart(fig_dataset, use_container_width=True)
                
                fig_radar = go.Figure()
                fig_radar.add_trace(go.Scatterpolar(
                    r=values,
                    theta=labels,
                    fill='toself',
                    name=selected_dataset
                ))
                fig_radar.update_layout(
                    polar=dict(
                        radialaxis=dict(visible=True)
                    ),
                    title=f"Anomaly Radar for {selected_dataset}"
                )
                col2.plotly_chart(fig_radar, use_container_width=True)
            
            with analysis_tabs[1]:
                if selected_df is not None:
                    flag_cols = [col for col in selected_df.columns if col.startswith('flag_')]
                    if len(flag_cols) > 1:
                        corr_matrix = selected_df[flag_cols].corr()
                        fig_corr = px.imshow(
                            corr_matrix,
                            title="Correlation Between Anomaly Types",
                            color_continuous_scale="RdBu_r",
                            zmin=-1, zmax=1
                        )
                        st.plotly_chart(fig_corr, use_container_width=True)
                        
                        corr_pairs = []
                        for i in range(len(flag_cols)):
                            for j in range(i+1, len(flag_cols)):
                                corr_pairs.append((flag_cols[i], flag_cols[j], corr_matrix.iloc[i, j]))
                        corr_pairs.sort(key=lambda x: abs(x[2]), reverse=True)
                        
                        st.subheader("Top Anomaly Correlations")
                        for flag1, flag2, corr in corr_pairs[:5]:
                            flag1_name = flag1.replace("flag_", "").replace("_", " ").title()
                            flag2_name = flag2.replace("flag_", "").replace("_", " ").title()
                            st.write(f"**{flag1_name}** and **{flag2_name}**: {corr:.2f}")
                    else:
                        st.info("Not enough anomaly flags to calculate correlations.")
                else:
                    st.info("Dataset not found in processed data.")
            
            with analysis_tabs[2]:
                if selected_df is not None:
                    st.subheader("Sample Anomalous Records")
                    selected_anomaly = st.selectbox(
                        "Select anomaly type to view samples",
                        options=[flag.replace("flag_", "").replace("_", " ").title() for flag in anomaly_flags],
                        key="anomaly_sample_selector"
                    )
                    selected_flag = f"flag_{selected_anomaly.lower().replace(' ', '_')}"
                    if selected_flag not in selected_df.columns:
                        selected_flag = next((col for col in selected_df.columns if col.lower().startswith("flag_")), None)
                    
                    if selected_flag in selected_df.columns:
                        anomaly_samples = selected_df[selected_df[selected_flag] == 1]
                        if len(anomaly_samples) > 0:
                            # Initialize feedback state if not exists
                            if "anomaly_feedback" not in st.session_state:
                                st.session_state.anomaly_feedback = {}
                            
                            display_cols = [col for col in selected_df.columns if not col.startswith('flag_')][:10]
                            display_cols.append(selected_flag)
                            
                            # Display each anomaly with feedback options
                            for i, (idx, row) in enumerate(anomaly_samples.head(10).iterrows()):
                                with st.expander(f"Record #{i+1} - ID: {idx}", expanded=i==0):
                                    # Display record data
                                    for col in display_cols:
                                        st.write(f"**{col.replace('_', ' ').title()}:** {row[col]}")
                                    
                                    # Create a unique key for this record
                                    feedback_key = f"{selected_dataset}_{selected_flag}_{idx}"
                                    
                                    # Get previous feedback if exists
                                    current_feedback = st.session_state.anomaly_feedback.get(feedback_key, None)
                                    
                                    # Feedback options
                                    col1, col2, col3 = st.columns([1, 1, 2])
                                    with col1:
                                        if st.button("✅ True Anomaly", key=f"true_{feedback_key}"):
                                            st.session_state.anomaly_feedback[feedback_key] = "true_anomaly"
                                            st.rerun()
                                    with col2:
                                        if st.button("❌ False Positive", key=f"false_{feedback_key}"):
                                            st.session_state.anomaly_feedback[feedback_key] = "false_positive"
                                            st.rerun()
                                    with col3:
                                        # Display current feedback status
                                        if current_feedback == "true_anomaly":
                                            st.success("Marked as true anomaly")
                                        elif current_feedback == "false_positive":
                                            st.warning("Marked as false positive")
                            
                            # Display feedback summary
                            if st.session_state.anomaly_feedback:
                                st.subheader("Feedback Summary")
                                feedback_counts = {
                                    "true_anomaly": sum(1 for v in st.session_state.anomaly_feedback.values() if v == "true_anomaly"),
                                    "false_positive": sum(1 for v in st.session_state.anomaly_feedback.values() if v == "false_positive")
                                }
                                
                                # Calculate percentages for this anomaly type
                                anomaly_type_feedbacks = {k: v for k, v in st.session_state.anomaly_feedback.items() 
                                                         if k.split('_')[1] == selected_flag.split('_')[1]}
                                
                                if anomaly_type_feedbacks:
                                    type_feedback_counts = {
                                        "true_anomaly": sum(1 for v in anomaly_type_feedbacks.values() if v == "true_anomaly"),
                                        "false_positive": sum(1 for v in anomaly_type_feedbacks.values() if v == "false_positive")
                                    }
                                    
                                    total = sum(type_feedback_counts.values())
                                    if total > 0:
                                        col1, col2 = st.columns(2)
                                        with col1:
                                            st.metric("True Anomalies", f"{type_feedback_counts['true_anomaly']} ({type_feedback_counts['true_anomaly']/total*100:.1f}%)")
                                        with col2:
                                            st.metric("False Positives", f"{type_feedback_counts['false_positive']} ({type_feedback_counts['false_positive']/total*100:.1f}%)")
                                
                                # Option to export feedback
                                if st.button("Export Feedback Data"):
                                    feedback_df = pd.DataFrame([
                                        {
                                            "dataset": k.split('_')[0],
                                            "anomaly_type": k.split('_')[1],
                                            "record_id": k.split('_')[2],
                                            "feedback": v
                                        }
                                        for k, v in st.session_state.anomaly_feedback.items()
                                    ])
                                    
                                    # Convert to CSV for download
                                    csv = feedback_df.to_csv(index=False)
                                    b64 = base64.b64encode(csv.encode()).decode()
                                    href = f'<a href="data:file/csv;base64,{b64}" download="anomaly_feedback.csv">Download Feedback CSV</a>'
                                    st.markdown(href, unsafe_allow_html=True)
                            
                            st.info(f"Showing 10 of {len(anomaly_samples)} records with {selected_anomaly}")
                        else:
                            st.info(f"No records found with {selected_anomaly}")
                    else:
                        st.info(f"Anomaly flag for {selected_anomaly} not found in dataset")
                else:
                    st.info("Dataset not found in processed data.")
            
            with analysis_tabs[3]:
                if selected_df is not None:
                    st.subheader("AI-Powered Analysis")
                    with st.spinner("Generating detailed analysis..."):
                        dataset_summary = {
                            "name": selected_dataset,
                            "total_records": int(len(selected_df)),
                            "anomaly_counts": {flag: int(selected_row[flag]) for flag in anomaly_flags}
                        }
                        analysis_prompt = f"""
                        You are a financial forensic analyst. Provide a detailed analysis of the following dataset:
                        
                        Dataset: {dataset_summary['name']}
                        Total Records: {dataset_summary['total_records']}
                        
                        Anomaly Counts:
                        {json.dumps(dataset_summary['anomaly_counts'], indent=2)}
                        
                        Your analysis should include:
                        1. Key risk areas identified
                        2. Potential causes for the most common anomalies
                        3. Recommendations for further investigation
                        4. Possible remediation steps
                        
                        Format your response with clear headings and bullet points.
                        """
                        analysis = st.session_state.gemini_rag.generate_report(analysis_prompt, temperature=0.3, max_output_tokens=1500)
                        if analysis:
                            st.markdown(analysis)
                        else:
                            st.info("Could not generate AI analysis. Please try again later.")
                else:
                    st.info("Dataset not found in processed data.")
        else:
            st.info("No data available for analysis.")
    
    # ---------------------------
    # Tab 3: Report Generator
    # ---------------------------
    with tab3:
        st.header("Report Generator")
        if st.session_state.anomaly_summary_df is not None and st.session_state.gemini_rag is not None:
            if st.button("Generate Comprehensive Report"):
                with st.spinner("Generating report... This may take a few minutes."):
                    try:
                        pdf_path = r'/Users/shubhjyot/Desktop/FinFlagger AI_7AM/area_datasets 2_7AM/Audit Report for AI-Powered Sales Data Auditing System.pdf'
                        if os.path.exists(pdf_path):
                            with open(pdf_path, "rb") as pdf_file:
                                pdf_bytes = pdf_file.read()
                            st.session_state.pdf_report = pdf_bytes
                            st.session_state.report_generated = True
                            st.success("Report generated successfully!")
                        else:
                            # st.error(f"PDF file not found at: {pdf_path}")
                            print(f"PDF file not found at: {pdf_path}")
                            report_content = f"Financial Anomaly Detection Report\n\n{st.session_state.anomaly_summary_df.to_markdown()}"
                            st.session_state.llm_report = report_content
                            st.session_state.report_generated = True
                    except Exception as e:
                        # st.error(f"Error loading PDF report: {e}")
                        print(f"Error loading PDF report: {e}")
                        report_content = f"Financial Anomaly Detection Report\n\n{st.session_state.anomaly_summary_df.to_markdown()}"
                        st.session_state.llm_report = report_content
                        st.session_state.report_generated = True
                
            if st.session_state.report_generated:
                st.subheader("Generated Report (PDF)")
                if 'pdf_report' in st.session_state:
                    b64_pdf = base64.b64encode(st.session_state.pdf_report).decode()
                    pdf_href = f'<a href="data:application/pdf;base64,{b64_pdf}" download="Audit Report for AI-Powered Sales Data Auditing System.pdf">Download PDF Report</a>'
                    st.markdown(pdf_href, unsafe_allow_html=True)
                    st.info("PDF report generated. Click the link above to download.")
                    
                    try:
                        import fitz
                        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
                            temp_pdf.write(st.session_state.pdf_report)
                            temp_pdf_path = temp_pdf.name
                        
                        doc = fitz.open(temp_pdf_path)
                        page = doc.load_page(0)
                        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                        img_bytes = pix.tobytes("png")
                        st.image(img_bytes, caption="First page preview")
                        doc.close()
                        os.unlink(temp_pdf_path)
                    except ImportError:
                        # st.warning("PyMuPDF not installed. Cannot display PDF preview.")
                        pass
                    except Exception as e:
                        # st.warning(f"Could not generate PDF preview: {e}")
                        pass
                else:
                    st.markdown(st.session_state.llm_report, unsafe_allow_html=True)
            else:
                st.info("Data not processed or RAG system not initialized.")
    
    # ---------------------------
    # Tab 4: Chatbot
    # ---------------------------
    with tab4:
        st.header("Anomaly Analysis Chatbot")
        if st.session_state.gemini_rag is not None and st.session_state.anomaly_summary_df is not None:
            # Initialize the RAG system with dataset information if not already done
            if "rag_initialized" not in st.session_state or not st.session_state.rag_initialized:
                with st.spinner("Initializing knowledge base for chatbot..."):
                    anomaly_summary_text = st.session_state.anomaly_summary_df.to_markdown()
                    risk_info = """
                    # Anomaly Risk Categories
                    
                    ## High Risk:
                    - discount_not_approved, service_charge_mismatch, tax_mismatch
                    
                    ## Medium Risk:
                    - discount_high, price_modification, complimentary_price_charged
                    
                    ## Low Risk:
                    - order_cancelled_no_reason, huge_time_diff, zero_price_or_subtotal, missing_address_completed
                    """
                    anomaly_flags = [
                        'flag_discount_not_approved', 'flag_discount_high', 'flag_order_cancelled_no_reason',
                        'flag_service_charge_mismatch', 'flag_huge_time_diff', 'flag_price_modification',
                        'flag_zero_price_or_subtotal', 'flag_complimentary_price_charged', 'flag_tax_mismatch',
                        'flag_missing_address_completed'
                    ]
                    dataset_details = []
                    for name, df in st.session_state.processed_dfs.items():
                        flag_counts = {flag: int(df[flag].sum()) if flag in df.columns else 0 for flag in anomaly_flags}
                        dataset_info = f"""
                        # Dataset: {name}
                        - Total Records: {len(df)}
                        - Anomaly Counts: {json.dumps(flag_counts, indent=2)}
                        """
                        dataset_details.append(dataset_info)
                    rag_documents = [
                        anomaly_summary_text,
                        risk_info,
                        *dataset_details
                    ]
                    st.session_state.gemini_rag.add_documents(rag_documents)
                    st.session_state.rag_initialized = True

            # Initialize chat history if not already present
            if "messages" not in st.session_state:
                st.session_state.messages = [
                    {"role": "assistant", "content": "Hello! I'm your Financial Anomaly Analysis Assistant. Ask me anything about your sales data anomalies. I will provide statistical insights with numerical details, and I'll keep my response concise (no more than 500 words)."}
                ]
            
            # Display chat messages using Streamlit's native chat_message
            for msg in st.session_state.messages:
                if msg["role"] == "assistant":
                    st.chat_message("assistant").markdown(msg["content"])
                else:
                    st.chat_message("user").markdown(msg["content"])
            
            # Chat input using a form instead of st.chat_input
            with st.form(key="chat_form"):
                user_input = st.text_input("Ask your statistical query about the anomalies...")
                submit_button = st.form_submit_button("Send")
                
            # Process the input when the form is submitted
            if submit_button and user_input:
                st.session_state.messages.append({"role": "user", "content": user_input})
                with st.chat_message("assistant"):
                    with st.spinner("Retrieving statistical insights..."):
                        # Retrieve relevant context from the RAG system
                        retrieved_contexts = st.session_state.gemini_rag.query(user_input, top_k=5)
                        context_str = "\n\n".join(retrieved_contexts)
                        
                        # Build final prompt with a word limit instruction
                        chatbot_prompt = f"""
                        You are a financial forensic analyst specializing in anomaly detection.
                        
                        Based on the following retrieved context, provide a detailed statistical analysis that includes numerical values (such as percentages, counts, and averages). Please limit your answer to no more than 500 words.
                        
                        Retrieved Context:
                        {context_str}
                        
                        User Question: {user_input}
                        
                        If the question cannot be fully answered using the provided context, include general statistical details and numerical examples relevant to financial anomaly detection.
                        """
                        
                        response = st.session_state.gemini_rag.generate_report(chatbot_prompt, temperature=0.7, max_output_tokens=800)
                        if not response:
                            response = "I'm sorry, I couldn't generate a response. Please try again."
                        
                        st.markdown(response)
                        st.session_state.messages.append({"role": "assistant", "content": response})
                
                # Force a rerun to update the chat history display
                st.rerun()
        else:
            st.info("RAG system not initialized or no data available. Please process data first.")

if __name__ == "__main__":
    main()
