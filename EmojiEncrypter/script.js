// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Encryption functionality
    const encryptBtn = document.getElementById('encrypt-btn');
    const encryptInput = document.getElementById('encrypt-input');
    const encryptResult = document.getElementById('encrypt-result');
    
    encryptBtn.addEventListener('click', () => {
        const text = encryptInput.value.trim();
        if (text) {
            try {
                const encrypted = encryptText(text);
                encryptResult.textContent = encrypted;
            } catch (e) {
                encryptResult.textContent = e.message || 'Encryption failed.';
                console.error('Encrypt button error:', e);
            }
        } else {
            encryptResult.textContent = 'Please enter text to encrypt';
        }
    });
    
    // Decryption functionality
    const decryptBtn = document.getElementById('decrypt-btn');
    const decryptInput = document.getElementById('decrypt-input');
    const decryptResult = document.getElementById('decrypt-result');
    
    decryptBtn.addEventListener('click', () => {
        const emojis = decryptInput.value.trim();
        if (emojis) {
            try {
                const decrypted = decryptEmojis(emojis);
                decryptResult.textContent = decrypted;
            } catch (error) {
                decryptResult.textContent = 'Invalid emoji sequence. Please check and try again.';
            }
        } else {
            decryptResult.textContent = 'Please enter emojis to decrypt';
        }
    });
    
    // Copy to clipboard functionality
    const copyEncrypt = document.getElementById('copy-encrypt');
    const copyDecrypt = document.getElementById('copy-decrypt');
    
    copyEncrypt.addEventListener('click', () => {
        copyToClipboard(encryptResult.textContent);
        showCopyFeedback(copyEncrypt);
    });
    
    copyDecrypt.addEventListener('click', () => {
        copyToClipboard(decryptResult.textContent);
        showCopyFeedback(copyDecrypt);
    });
    
    function showCopyFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }
    
    // Simple character-to-emoji mapping for encryption
    function encryptText(text) {
        // Use a compact mapping: base64 encoding, then emoji mapping
        const encoder = new TextEncoder();
        const textBytes = encoder.encode(text);
        const base64 = btoa(String.fromCharCode(...textBytes));
        return base64ToEmojis(base64);
    }

    function decryptEmojis(emojis) {
        const base64 = emojisToBase64(emojis);
        const encryptedStr = atob(base64);
        const bytes = Uint8Array.from(encryptedStr, c => c.charCodeAt(0));
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

    // 65 unique emojis for base64 (including padding)
    const emojiBase64 = [
        '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰',
        '😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥳','😏','😒',
        '😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡',
        '🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶',
        '🛡️' // Padding for '='
    ];
    const base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    function base64ToEmojis(base64) {
        let emojiStr = '';
        for (let c of base64) {
            const idx = base64chars.indexOf(c);
            if (idx === -1) {
                console.error('Invalid base64 character in mapping:', c);
                throw new Error('Invalid base64 character in mapping: ' + c);
            }
            emojiStr += emojiBase64[idx];
        }
        return emojiStr;
    }
    function emojisToBase64(emojiStr) {
        let base64 = '';
        let i = 0;
        while (i < emojiStr.length) {
            let found = false;
            for (let j = 0; j < emojiBase64.length; j++) {
                const emoji = emojiBase64[j];
                if (emojiStr.startsWith(emoji, i)) {
                    base64 += base64chars[j];
                    i += emoji.length;
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.error('Invalid emoji in sequence at position', i, emojiStr.slice(i, i+4));
                throw new Error('Invalid emoji in sequence');
            }
        }
        return base64;
    }
});