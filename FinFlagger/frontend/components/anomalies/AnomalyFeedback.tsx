import React, { useState } from 'react';

type AnomalyFeedbackProps = {
  anomalyId: string;
  onSubmitFeedback: (anomalyId: string, isTruePositive: boolean, comments: string) => Promise<void>;
  initialFeedback?: {
    isTruePositive: boolean;
    comments: string;
  } | null;
};

const AnomalyFeedback: React.FC<AnomalyFeedbackProps> = ({ 
  anomalyId, 
  onSubmitFeedback,
  initialFeedback
}) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isTruePositive, setIsTruePositive] = useState<boolean | null>(
    initialFeedback ? initialFeedback.isTruePositive : null
  );
  const [comments, setComments] = useState(initialFeedback?.comments || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(!!initialFeedback);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitFeedback = async () => {
    if (isTruePositive === null) {
      setError('Please select whether this is a true or false positive');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmitFeedback(anomalyId, isTruePositive, comments);
      setFeedbackSubmitted(true);
      setShowFeedbackForm(false);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Feedback submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      {feedbackSubmitted ? (
        <div style={styles.feedbackSubmitted}>
          <p>Thank you for your feedback!</p>
          <button 
            style={styles.editButton}
            onClick={() => setShowFeedbackForm(true)}
          >
            Edit Feedback
          </button>
        </div>
      ) : (
        <button 
          style={styles.feedbackButton}
          onClick={() => setShowFeedbackForm(true)}
        >
          Provide Feedback
        </button>
      )}

      {showFeedbackForm && (
        <div style={styles.feedbackForm}>
          <h4 style={styles.feedbackTitle}>Anomaly Feedback</h4>
          <p style={styles.feedbackDescription}>
            Your feedback helps improve our anomaly detection system.
          </p>

          <div style={styles.radioGroup}>
            <div style={styles.radioOption}>
              <input 
                type="radio" 
                id="truePositive" 
                name="feedbackType" 
                checked={isTruePositive === true}
                onChange={() => setIsTruePositive(true)}
              />
              <label htmlFor="truePositive">True Positive (Correct Alert)</label>
            </div>
            <div style={styles.radioOption}>
              <input 
                type="radio" 
                id="falsePositive" 
                name="feedbackType" 
                checked={isTruePositive === false}
                onChange={() => setIsTruePositive(false)}
              />
              <label htmlFor="falsePositive">False Positive (Incorrect Alert)</label>
            </div>
          </div>

          <div style={styles.textareaContainer}>
            <label htmlFor="comments" style={styles.textareaLabel}>Additional Comments:</label>
            <textarea 
              id="comments"
              style={styles.textarea}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Please provide any additional context that might help improve our detection system..."
              rows={4}
            />
          </div>

          {error && <p style={styles.errorMessage}>{error}</p>}

          <div style={styles.buttonGroup}>
            <button 
              style={styles.cancelButton}
              onClick={() => setShowFeedbackForm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              style={styles.submitButton}
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '1rem',
  },
  feedbackButton: {
    backgroundColor: 'transparent',
    color: '#64ffda',
    border: '1px solid #64ffda',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    width: '100%',
  },
  feedbackSubmitted: {
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderRadius: '4px',
    padding: '0.75rem',
    fontSize: '0.9rem',
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  editButton: {
    backgroundColor: 'transparent',
    color: '#64ffda',
    border: '1px solid #64ffda',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  feedbackForm: {
    marginTop: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
    padding: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  feedbackTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    color: '#e6f1ff',
  },
  feedbackDescription: {
    margin: '0 0 1rem 0',
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  radioGroup: {
    marginBottom: '1rem',
  },
  radioOption: {
    marginBottom: '0.5rem',
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '0.5rem',
  },
  textareaContainer: {
    marginBottom: '1rem',
  },
  textareaLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#e6f1ff',
    fontSize: '0.9rem',
    resize: 'vertical' as const,
  },
  errorMessage: {
    color: '#ff4d4f',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  buttonGroup: {
    display: 'flex' as const,
    justifyContent: 'flex-end' as const,
    gap: '0.75rem',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  submitButton: {
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    color: '#64ffda',
    border: '1px solid #64ffda',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default AnomalyFeedback;