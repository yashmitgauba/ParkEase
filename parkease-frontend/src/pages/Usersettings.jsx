import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/shared.css';
import '../styles/Usersettings.css';

const UserSettings = () => {
  const [notifications, setNotifications] = useState({
    bookingConfirmations: true,
    upcomingBookings: true,
    paymentConfirmations: true,
    promotions: false
  });

  return (
    <div className="settings-container">
      <h1>Account Settings</h1>

      {/* Account Settings */}
      <section className="settings-section">
        <div className="setting-item">
          <div className="setting-info">
            <i className="fas fa-user"></i>
            <div>
              <h4>User Profile</h4>
              <p>Update your personal information</p>
            </div>
          </div>
          <i className="fas fa-chevron-right"></i>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <i className="fas fa-lock"></i>
            <div>
              <h4>Change Password</h4>
              <p>Update your password</p>
            </div>
          </div>
          <i className="fas fa-chevron-right"></i>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <i className="fas fa-credit-card"></i>
            <div>
              <h4>Payment Methods</h4>
              <p>Manage your payment options</p>
            </div>
          </div>
          <i className="fas fa-chevron-right"></i>
        </div>
      </section>

      {/* App Preferences */}
      <section className="settings-section">
        <h2>App Preferences</h2>
        
        <div className="setting-item">
          <div className="setting-info">
            <i className="fas fa-moon"></i>
            <div>
              <h4>Theme Settings</h4>
              <p>Choose between light and dark mode</p>
            </div>
          </div>
          <div className="toggle-switch">
            <input type="checkbox" id="theme-toggle" />
            <label htmlFor="theme-toggle"></label>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <i className="fas fa-globe"></i>
            <div>
              <h4>Language</h4>
              <p>Choose your preferred language</p>
            </div>
          </div>
          <i className="fas fa-chevron-right"></i>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <i className="fas fa-dollar-sign"></i>
            <div>
              <h4>Currency</h4>
              <p>Choose your preferred currency</p>
            </div>
          </div>
          <i className="fas fa-chevron-right"></i>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="settings-section">
        <h2>Notification Settings</h2>
        
        <div className="setting-item">
          <div className="setting-info">
            <div>
              <h4>Booking Confirmations</h4>
              <p>Receive notifications for booking confirmations</p>
            </div>
          </div>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.bookingConfirmations}
              onChange={() => setNotifications({
                ...notifications,
                bookingConfirmations: !notifications.bookingConfirmations
              })}
            />
            <label></label>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div>
              <h4>Upcoming Bookings</h4>
              <p>Get reminders for upcoming parking sessions</p>
            </div>
          </div>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.upcomingBookings}
              onChange={() => setNotifications({
                ...notifications,
                upcomingBookings: !notifications.upcomingBookings
              })}
            />
            <label></label>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div>
              <h4>Payment Confirmations</h4>
              <p>Receive notifications for payment activities</p>
            </div>
          </div>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.paymentConfirmations}
              onChange={() => setNotifications({
                ...notifications,
                paymentConfirmations: !notifications.paymentConfirmations
              })}
            />
            <label></label>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <div>
              <h4>Promotions & Discounts</h4>
              <p>Stay updated with latest offers</p>
            </div>
          </div>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              checked={notifications.promotions}
              onChange={() => setNotifications({
                ...notifications,
                promotions: !notifications.promotions
              })}
            />
            <label></label>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="settings-section">
        <h2>Support</h2>
        
        <div className="setting-item">
          <div className="setting-info">
            <i className="fas fa-headset"></i>
            <div>
              <h4>Contact Support</h4>
              <p>Get help from our team</p>
            </div>
          </div>
          <i className="fas fa-chevron-right"></i>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <i className="fas fa-question-circle"></i>
            <div>
              <h4>FAQs</h4>
              <p>Find answers to common questions</p>
            </div>
          </div>
          <i className="fas fa-chevron-right"></i>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <i className="fas fa-bug"></i>
            <div>
              <h4>Report a Problem</h4>
              <p>Let us know if something's wrong</p>
            </div>
          </div>
          <i className="fas fa-chevron-right"></i>
        </div>
      </section>

      <div className="version-info">
        <p>App Version 1.0.0</p>
      </div>
    </div>
  );
};

export default UserSettings;
