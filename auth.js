// Authentication Manager for Cricket IPL Team Selector
// Handles user authentication with Google Sign-In

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // AUTO-FIX: Redirect 127.0.0.1 to localhost to allow Firebase Auth
        if (window.location.hostname === '127.0.0.1') {
            console.log("🔄 Redirecting to localhost for Firebase Auth compatibility...");
            window.location.hostname = 'localhost';
            return;
        }

        // Listen for authentication state changes
        if (typeof firebaseAuth !== 'undefined') {
            firebaseAuth.onAuthStateChanged((user) => {
                this.currentUser = user;
                this.updateUI(user);

                if (user) {
                    console.log('✅ User signed in:', user.displayName);
                } else {
                    console.log('👤 No user signed in');
                }
            });
        }
    }

    // Sign in with Google
    async signInWithGoogle() {
        try {
            // Explicitly set persistence to LOCAL
            await firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

            const result = await firebaseAuth.signInWithPopup(googleProvider);
            const user = result.user;

            this.showToast(`Welcome, ${user.displayName}!`, 'success');
            this.hideAuthModal();

            return user;
        } catch (error) {
            console.error('Sign-in error:', error);

            let msg = 'Sign-in failed. Please try again.';

            // Detailed Error Handling
            if (error.code === 'auth/popup-closed-by-user') {
                msg = 'Sign-in cancelled.';
            } else if (error.code === 'auth/network-request-failed') {
                msg = 'Network error. Please check your internet connection.';
            } else if (error.code === 'auth/web-storage-unsupported') {
                msg = 'Browser cookies are disabled. Please enable them.';
            } else if (error.code === 'auth/unauthorized-domain') {
                msg = 'Domain Error: Please use localhost:8000 instead of 127.0.0.1';
            } else if (error.code === 'auth/operation-not-allowed') {
                msg = 'Google Sign-In is not enabled in Firebase Console.';
            } else {
                msg = `Error: ${error.message}`;
            }

            this.showToast(msg, 'error');
            // Alert removed - Issue diagnosed
            throw error;
        }
    }

    // Sign in with Email/Password
    async signInWithEmail(email, password) {
        const errorEl = document.getElementById('authErrorMsg');
        if (errorEl) errorEl.classList.add('hidden');
        try {
            await firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            const result = await firebaseAuth.signInWithEmailAndPassword(email, password);
            this.showToast(`Welcome back, ${result.user.email}!`, 'success');
            this.hideAuthModal();
        } catch (error) {
            const msg = this.getErrorMessage(error);
            if (errorEl) { errorEl.textContent = msg; errorEl.classList.remove('hidden'); }
            else this.showToast(msg, 'error');
        }
    }

    // Sign up with Email/Password
    async signUpWithEmail(email, password) {
        const errorEl = document.getElementById('authErrorMsg');
        if (errorEl) errorEl.classList.add('hidden');
        try {
            await firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            const result = await firebaseAuth.createUserWithEmailAndPassword(email, password);
            this.showToast(`Account created! Welcome, ${result.user.email}!`, 'success');
            this.hideAuthModal();
        } catch (error) {
            const msg = this.getErrorMessage(error);
            if (errorEl) { errorEl.textContent = msg; errorEl.classList.remove('hidden'); }
            else this.showToast(msg, 'error');
        }
    }

    // Sign in Anonymously (Guest)
    async signInAsGuest() {
        try {
            await firebaseAuth.signInAnonymously();
            this.showToast('Signed in as Guest. Squads won\'t be saved permanently.', 'success');
            this.hideAuthModal();
        } catch (error) {
            this.showToast(this.getErrorMessage(error), 'error');
        }
    }

    // Get human-readable error message
    getErrorMessage(error) {
        const map = {
            'auth/popup-closed-by-user': 'Sign-in cancelled.',
            'auth/network-request-failed': 'Network error. Check your connection.',
            'auth/web-storage-unsupported': 'Enable browser cookies and try again.',
            'auth/unauthorized-domain': 'Domain not authorised. Use localhost.',
            'auth/operation-not-allowed': 'This sign-in method is not enabled.',
            'auth/user-not-found': 'No account found with that email.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/email-already-in-use': 'An account with this email already exists.',
            'auth/weak-password': 'Password should be at least 6 characters.',
            'auth/invalid-email': 'Please enter a valid email address.',
        };
        return map[error.code] || error.message;
    }

    // Sign out
    async signOut() {
        try {
            await firebaseAuth.signOut();
            this.showToast('Signed out successfully', 'success');
        } catch (error) {
            console.error('Sign-out error:', error);
            this.showToast('Sign-out failed', 'error');
        }
    }

    // Update UI based on auth state
    updateUI(user) {
        const authButton = document.getElementById('authButton');
        const userProfile = document.getElementById('userProfile');

        if (!authButton || !userProfile) return;

        if (user) {
            // User is signed in
            authButton.classList.add('hidden');
            userProfile.classList.remove('hidden');

            const userAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');

            if (userAvatar) userAvatar.src = user.photoURL || 'https://via.placeholder.com/40';
            if (userName) userName.textContent = user.displayName || 'User';
        } else {
            // User is signed out
            authButton.classList.remove('hidden');
            userProfile.classList.add('hidden');
        }
    }

    // Show authentication modal
    showAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    // Hide authentication modal
    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Require authentication (show modal if not signed in)
    requireAuth() {
        if (!this.isAuthenticated()) {
            this.showAuthModal();
            return false;
        }
        return true;
    }
}

// Initialize auth manager when DOM is ready
let authManager;
document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
    window.authManager = authManager;

    // Auth open button
    const authButton = document.getElementById('authButton');
    if (authButton) authButton.addEventListener('click', () => authManager.showAuthModal());

    // Google sign-in
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    if (googleSignInBtn) googleSignInBtn.addEventListener('click', () => authManager.signInWithGoogle());

    // Email sign-in
    const emailSignInBtn = document.getElementById('emailSignInBtn');
    if (emailSignInBtn) emailSignInBtn.addEventListener('click', () => {
        const email = document.getElementById('authEmail').value.trim();
        const password = document.getElementById('authPassword').value;
        authManager.signInWithEmail(email, password);
    });

    // Email sign-up
    const emailSignUpBtn = document.getElementById('emailSignUpBtn');
    if (emailSignUpBtn) emailSignUpBtn.addEventListener('click', () => {
        const email = document.getElementById('authEmail').value.trim();
        const password = document.getElementById('authPassword').value;
        authManager.signUpWithEmail(email, password);
    });

    // Guest / Anonymous
    const guestSignInBtn = document.getElementById('guestSignInBtn');
    if (guestSignInBtn) guestSignInBtn.addEventListener('click', () => authManager.signInAsGuest());

    // Sign out
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) signOutBtn.addEventListener('click', () => authManager.signOut());

    // Close modal (overlay click)
    const closeModalBtn = document.getElementById('closeAuthModal');
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => authManager.hideAuthModal());

    // Close modal (X button)
    const closeModalXBtn = document.getElementById('closeAuthModalBtn');
    if (closeModalXBtn) closeModalXBtn.addEventListener('click', () => authManager.hideAuthModal());
});
