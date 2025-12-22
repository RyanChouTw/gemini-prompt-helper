# Privacy Policy for Gemini Prompt Helper

**Last updated:** December 18, 2024

## Introduction

This Privacy Policy describes how the Gemini Prompt Helper Chrome extension ("we," "our," or "the extension") collects, uses, and protects your information when you use our extension.

## Information We Collect

### 1. Local Storage Data
The extension stores the following information locally on your device using Chrome's storage API:

- **Prompt Templates**: Custom templates you create, including title, content, category, and tags
- **Usage Statistics**: Template usage counts and last used dates for improving your experience
- **User Preferences**: Settings such as theme preference, button position, and extension configuration
- **Extension Metadata**: Installation date, data schema version, and last backup timestamps

### 2. API Key Information
- **Gemini API Key**: If you choose to use the prompt optimization feature, your personal Gemini API key is stored locally in your browser
- This key is only used to communicate directly with Google's Gemini API when you explicitly request prompt optimization

### 3. Website Interaction Data
- **Selected Text**: When you use the "Save as Template" context menu, the extension temporarily processes the text you select
- **Current Tab URL**: Used only to detect if you're on gemini.google.com to enable direct template application

## How We Use Your Information

### 1. Core Functionality
- Store and manage your prompt templates locally
- Synchronize your data across your Chrome browsers (if Chrome sync is enabled)
- Apply templates to Gemini's input fields when requested
- Provide prompt optimization suggestions through the Gemini API (when you provide an API key)

### 2. User Experience Enhancement
- Remember your preferences and settings
- Track template usage for better organization and recommendations
- Provide seamless integration with the Gemini website

## Data Storage and Security

### 1. Local Storage Only
- All your data is stored locally in Chrome's secure storage system
- No data is transmitted to our servers or third-party services (except direct API calls you initiate)
- Data synchronization occurs only through Chrome's built-in sync service (if enabled by you)

### 2. Data Security
- Chrome's storage API provides encryption and security protections
- Your API keys and templates remain on your device
- No external databases or cloud services are used by our extension

## Data Sharing and Third Parties

### 1. No Data Sharing
- We do not sell, trade, or transfer your data to third parties
- We do not have access to your locally stored data
- We do not collect analytics or tracking data

### 2. Gemini API Communication
- When you use the optimization feature with your API key, communications occur directly between your browser and Google's Gemini API
- We do not intercept, store, or access these communications
- Refer to Google's Privacy Policy for how they handle Gemini API data

## Data Retention and Deletion

### 1. Data Control
- You have complete control over your data
- Templates and settings can be deleted individually or all at once through the extension interface
- Uninstalling the extension removes all locally stored data

### 2. Data Export
- You can export your templates and settings at any time
- Exported data is saved as a JSON file on your device

## Permissions and Access

The extension requires the following permissions for functionality:

- **Storage**: To save templates and settings locally
- **Active Tab**: To detect Gemini pages and apply templates
- **Context Menus**: To add "Save as Template" option when text is selected
- **Scripting**: To inject content scripts for Gemini page integration
- **Host Permission (gemini.google.com)**: To interact with Gemini's interface

## Your Rights and Choices

### 1. Data Access
- Access all your stored data through the extension's options page
- View, edit, or delete any template or setting at any time

### 2. Data Portability
- Export your data in JSON format for backup or migration
- Import previously exported data to restore your templates

### 3. Opt-out Options
- Disable any extension features through the settings
- Choose not to provide a Gemini API key to avoid optimization features
- Disable Chrome sync to keep data only on the current device

## Children's Privacy

This extension is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. When we do, we will:
- Update the "Last updated" date at the top of this policy
- Notify users of significant changes through the extension's interface
- Continue to protect your data according to the principles outlined in this policy

## Contact Information

If you have questions about this Privacy Policy or the extension's data practices, please contact us through:
- GitHub Issues: [Project Repository]
- Chrome Web Store developer contact

## Compliance and Legal

This extension is designed to comply with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) requirements

## Technical Details

### Data Types and Purposes
| Data Type | Purpose | Storage Location | Retention |
|-----------|---------|------------------|-----------|
| Templates | Core functionality | Local Chrome storage | Until deleted by user |
| Settings | User preferences | Local Chrome storage | Until deleted by user |
| API Key | Optimization feature | Local Chrome storage | Until removed by user |
| Usage stats | UX improvement | Local Chrome storage | Until deleted by user |

### Security Measures
- Chrome's built-in storage encryption
- No network transmission of sensitive data
- Local-only data processing
- Minimal permission requests
- Open source codebase for transparency

By using the Gemini Prompt Helper extension, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.