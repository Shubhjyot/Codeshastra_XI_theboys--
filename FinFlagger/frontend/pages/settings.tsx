import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import Layout from '../components/layout/Layout';
import { Card, Slider, Switch, Select, Button, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Option } = Select;

// Add TypeScript interface for settings
interface SettingsState {
  detectionSensitivity: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  alertThreshold: string;
  dailyDigest: boolean;
  autoResolveRules: boolean;
  dataRetentionPeriod: number;
  teamNotifications: boolean;
  riskScoreThreshold: number;
}

const Settings: React.FC = () => {
  const { fetchAlertSettings, updateAlertSettings } = useApi();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SettingsState>({
    detectionSensitivity: 50,
    emailNotifications: true,
    pushNotifications: false,
    alertThreshold: 'medium',
    dailyDigest: true,
    autoResolveRules: false,
    dataRetentionPeriod: 90,
    teamNotifications: true,
    riskScoreThreshold: 65
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await fetchAlertSettings();
        if (data) {
          setSettings({
            ...settings,
            ...data
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        message.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [fetchAlertSettings]);

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await updateAlertSettings(settings);
      message.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      message.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: number | string | boolean) => {
    setSettings({
      ...settings,
      [name]: value
    });
  };

  return (
    <Layout title="Settings">
      <div className="container">
        <h1 className="page-title">Settings</h1>
        
        <div className="card">
          <div className="card-header">Detection Settings</div>
          <div className="card-body">
            <div className="setting-item">
              <div className="setting-label">
                <h3>Detection Sensitivity</h3>
                <p>Adjust how sensitive the anomaly detection system is. Higher values may detect more anomalies but could increase false positives.</p>
              </div>
              <div className="setting-control">
                <Slider
                  value={settings.detectionSensitivity}
                  onChange={(value: number) => handleChange('detectionSensitivity', value)}
                  min={0}
                  max={100}
                  step={5}
                  marks={{
                    0: 'Low',
                    50: 'Medium',
                    100: 'High'
                  }}
                />
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-label">
                <h3>Risk Score Threshold</h3>
                <p>Set the minimum risk score for flagging transactions as anomalies.</p>
              </div>
              <div className="setting-control">
                <Slider
                  value={settings.riskScoreThreshold}
                  onChange={(value: number) => handleChange('riskScoreThreshold', value)}
                  min={0}
                  max={100}
                  step={5}
                  marks={{
                    0: 'Low',
                    50: 'Medium',
                    100: 'High'
                  }}
                />
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-label">
                <h3>Alert Threshold</h3>
                <p>Set the minimum severity level for generating alerts.</p>
              </div>
              <div className="setting-control">
                <Select
                  value={settings.alertThreshold}
                  onChange={(value: string) => handleChange('alertThreshold', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="low">Low (All Anomalies)</Option>
                  <Option value="medium">Medium (Medium & High Severity)</Option>
                  <Option value="high">High (High Severity Only)</Option>
                </Select>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-label">
                <h3>Auto-Resolve Rules</h3>
                <p>Automatically resolve low-risk anomalies after verification.</p>
              </div>
              <div className="setting-control">
                <Switch
                  checked={settings.autoResolveRules}
                  onChange={(checked: boolean) => handleChange('autoResolveRules', checked)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">Notification Preferences</div>
          <div className="card-body">
            <div className="setting-item">
              <div className="setting-label">
                <h3>Email Notifications</h3>
                <p>Receive email alerts for new anomalies.</p>
              </div>
              <div className="setting-control">
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(checked: boolean) => handleChange('emailNotifications', checked)}
                />
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-label">
                <h3>Push Notifications</h3>
                <p>Receive browser push notifications for new anomalies.</p>
              </div>
              <div className="setting-control">
                <Switch
                  checked={settings.pushNotifications}
                  onChange={(checked: boolean) => handleChange('pushNotifications', checked)}
                />
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-label">
                <h3>Daily Digest</h3>
                <p>Receive a daily summary of all anomalies.</p>
              </div>
              <div className="setting-control">
                <Switch
                  checked={settings.dailyDigest}
                  onChange={(checked: boolean) => handleChange('dailyDigest', checked)}
                />
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-label">
                <h3>Team Notifications</h3>
                <p>Notify team members when anomalies are assigned to them.</p>
              </div>
              <div className="setting-control">
                <Switch
                  checked={settings.teamNotifications}
                  onChange={(checked: boolean) => handleChange('teamNotifications', checked)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">Data Management</div>
          <div className="card-body">
            <div className="setting-item">
              <div className="setting-label">
                <h3>Data Retention Period</h3>
                <p>Set how long anomaly data is stored before being archived.</p>
              </div>
              <div className="setting-control">
                <Select
                  value={settings.dataRetentionPeriod}
                  onChange={(value: number) => handleChange('dataRetentionPeriod', value)}
                  style={{ width: '100%' }}
                >
                  <Option value={30}>30 Days</Option>
                  <Option value={90}>90 Days</Option>
                  <Option value={180}>6 Months</Option>
                  <Option value={365}>1 Year</Option>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            size="large"
            onClick={handleSaveSettings}
            loading={loading}
            className="btn btn-primary"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;