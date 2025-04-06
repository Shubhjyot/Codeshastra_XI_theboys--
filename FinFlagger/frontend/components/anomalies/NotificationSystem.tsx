import React from 'react';
import { Notification } from '../../types/anomaly';

interface NotificationSystemProps {
  notifications: Notification[];
  unreadCount: number;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  handleNotificationClick: (notification: Notification) => void;
  handleMarkAllAsRead: () => void;
  getSeverityColor: (severity: string) => string;
  formatNotificationTime: (dateString: string) => string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  unreadCount,
  showNotifications,
  setShowNotifications,
  handleNotificationClick,
  handleMarkAllAsRead,
  getSeverityColor,
  formatNotificationTime
}) => {
  return (
    <div style={styles.notificationContainer}>
      <button 
        style={styles.notificationButton} 
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Notifications"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {unreadCount > 0 && (
          <span style={styles.notificationBadge}>{unreadCount}</span>
        )}
      </button>
      
      {showNotifications && (
        <div style={styles.notificationDropdown}>
          <div style={styles.notificationHeader}>
            <h3 style={styles.notificationTitle}>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                style={styles.markAllReadButton}
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div style={styles.notificationList}>
            {notifications.length === 0 ? (
              <div style={styles.emptyNotifications}>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  style={{
                    ...styles.notificationItem,
                    ...(notification.read ? {} : styles.unreadNotification)
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div style={{
                    ...styles.notificationSeverity,
                    backgroundColor: getSeverityColor(notification.severity)
                  }}></div>
                  <div style={styles.notificationContent}>
                    <div style={styles.notificationItemHeader}>
                      <h4 style={styles.notificationItemTitle}>{notification.title}</h4>
                      <span style={styles.notificationTime}>
                        {formatNotificationTime(notification.createdAt)}
                      </span>
                    </div>
                    <p style={styles.notificationMessage}>{notification.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  notificationContainer: {
    position: 'relative' as const,
  },
  notificationButton: {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    position: 'relative' as const,
    padding: '0.5rem',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  notificationBadge: {
    position: 'absolute' as const,
    top: '0',
    right: '0',
    backgroundColor: '#ff4d4f',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: 'bold' as const,
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  notificationDropdown: {
    position: 'absolute' as const,
    top: '100%',
    right: '0',
    width: '350px',
    maxHeight: '500px',
    backgroundColor: '#1a2233',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    overflow: 'hidden' as const,
  },
  notificationHeader: {
    padding: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  notificationTitle: {
    margin: 0,
    color: '#e6f1ff',
    fontSize: '1.1rem',
  },
  markAllReadButton: {
    background: 'none',
    border: 'none',
    color: '#00b7ff',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  notificationList: {
    maxHeight: '400px',
    overflow: 'auto' as const,
  },
  emptyNotifications: {
    padding: '2rem',
    textAlign: 'center' as const,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  notificationItem: {
    display: 'flex' as const,
    padding: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  unreadNotification: {
    backgroundColor: 'rgba(0, 183, 255, 0.05)',
  },
  notificationSeverity: {
    width: '4px',
    borderRadius: '2px',
    marginRight: '1rem',
  },
  notificationContent: {
    flex: 1,
  },
  notificationItemHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: '0.5rem',
  },
  notificationItemTitle: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#e6f1ff',
  },
  notificationTime: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    marginLeft: '1rem',
  },
  notificationMessage: {
    margin: 0,
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.4',
  },
};

export default NotificationSystem;