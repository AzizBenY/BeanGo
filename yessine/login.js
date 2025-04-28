async function login(email, password) {
    try {
        console.log('Attempting to log in with:', email, password);

        // Check for specific credentials
        if (email === "Beango@gmail.com" && password === "beango") {
            window.location.href = "yessine/dashboard.html"; // Redirect to dashboard.html
            return; // Exit the function
        }

        // Proceed with Firebase authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        window.location.href = "../pages/index.html"; // Redirect to the main page after successful login

    } catch (error) {
        // Handle different error codes
        if (error.code === 'auth/user-not-found') {
            alert('No user found with this email. Please sign up.');
        } else if (error.code === 'auth/wrong-password') {
            alert('Incorrect password. Please try again.');
        } else if (error.code === 'auth/invalid-email') {
            alert('The email address is not valid. Please enter a valid email.');
        } else if (error.code === 'auth/invalid-login-credentials') {
            alert('Invalid email or password. Please try again.');
        } else {
            alert('Error: ' + error.message); // Fallback for other errors
        }
        console.error('Error:', error);
    }
}
