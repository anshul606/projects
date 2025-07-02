# Romantic 1st Anniversary Website

A beautiful, interactive, and personalized website to celebrate your first anniversary with your loved one. This project uses HTML, CSS, and JavaScript to create a memorable digital gift.

## Features

- **Starry Background**: A beautiful animated starry background that creates a romantic atmosphere.
- **Interactive Timeline**: A visual journey of your relationship milestones.
- **Love Letter**: A heartfelt message to your partner.
- **Photo Gallery**: Display your favorite moments together.
- **Love Counter**: Shows how many days, hours, and minutes you've been together.
- **Global Message in a Bottle**: Leave sweet messages that are shared with everyone who visits the site, with a universal delete option.
- **Future Plans**: Display places you want to visit and things you want to do together.
- **Anniversary Countdown**: Countdown to your next anniversary.
- **Confetti Animation**: Celebratory confetti effect when the page loads.
- **Responsive Design**: Looks great on both desktop and mobile devices.
- **Enhanced Romantic Design**: Beautiful gradient effects and a romantic color palette.

## How to Use

1. **Download the Files**: Make sure you have all three files: `index.html`, `styles.css`, and `script.js`.
2. **Set Up Firebase**: Create a Firebase project and update the configuration in the script.js file.
3. **Customize the Content**: Replace the placeholder text and images with your own personal content.
4. **Host the Website**: You can host it on platforms like GitHub Pages, Netlify, or any web hosting service.
5. **Share with Your Partner**: Send the link to your partner on your anniversary.

## Firebase Setup

To enable the global message feature, you need to set up Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Add a web app to your project
3. Enable the Realtime Database (not Firestore)
4. Set the database rules to allow read and write access:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
5. Copy your Firebase configuration and replace the placeholder in the script.js file:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       databaseURL: "YOUR_DATABASE_URL",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
   };
   ```

## Customization Guide

### Changing Images

Replace the placeholder images with your own photos:

```html
<!-- Example from the timeline section -->
<img src="YOUR_IMAGE_URL_HERE" alt="First Date" class="memory-img">
```

You can use direct image URLs or add images to your project folder and reference them relatively.

### Personalizing the Timeline

Edit the timeline events in the HTML file to reflect your own relationship milestones:

```html
<div class="timeline-item">
    <div class="timeline-date">YOUR_EVENT_NAME</div>
    <div class="timeline-content">
        <img src="YOUR_IMAGE_URL" alt="Event Description" class="memory-img">
        <p>YOUR_EVENT_DESCRIPTION</p>
    </div>
</div>
```

### Customizing the Love Letter

Edit the love letter content in the HTML file:

```html
<div class="letter-content">
    <p>YOUR_GREETING,</p>
    <p>YOUR_MESSAGE_PARAGRAPH_1</p>
    <p>YOUR_MESSAGE_PARAGRAPH_2</p>
    <p>YOUR_MESSAGE_PARAGRAPH_3</p>
    <p>YOUR_CLOSING,</p>
    <p class="signature">YOUR_NAME</p>
</div>
```

### Changing Colors and Styling

The main color scheme can be modified in the CSS file. The primary colors used are:

- Primary Pink: `#ff85a2` (Soft romantic pink)
- Secondary Purple: `#c9abff` (Lavender)
- Dark Background: `#1a0b2e` (Deep purple)

You can change these colors throughout the CSS file to match your preferred color scheme.

### Updating the Anniversary Date

To set the correct anniversary date for the countdown, modify this section in the JavaScript file:

```javascript
// In the initCountdown function
const nextAnniversary = new Date(today.getFullYear() + 1, YOUR_MONTH, YOUR_DAY);
// Note: Months are 0-indexed (0 = January, 11 = December)
```

Also update the footer date:

```html
<p class="date">YOUR_ANNIVERSARY_DATE - CURRENT_DATE</p>
```

## Message Management

The website includes a "Delete All Messages" button that allows you to clear all messages from the global message board. This is useful for:

- Removing inappropriate content
- Starting fresh with new messages
- Managing the message board when it gets too crowded

The delete action requires confirmation and affects all users, so use it responsibly.

## Browser Compatibility

This website works best on modern browsers such as:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## License

Feel free to use and modify this code for your personal anniversary celebration.

## Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Firebase for the global message feature
- Placeholder images from placeholder.com

---

Made with ❤️ for celebrating love and commitment. 